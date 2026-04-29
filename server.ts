import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { Server } from "socket.io";
import { createServer } from "http";
import https from "https";
import http from "http";

import { fileURLToPath } from 'url';

const getDirname = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (e) {
    return process.cwd();
  }
};
const _dirname = getDirname();

const DATA_FILE = path.resolve(process.cwd(), ".data/user_data.json");
const MEDIA_FILE = path.resolve(process.cwd(), ".data/media_data.json");
const DATA_DIR = path.resolve(process.cwd(), ".data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const AUDIO_DIR = path.resolve(process.cwd(), "audio_vault");
const IMAGE_DIR = path.resolve(process.cwd(), "image_vault");
const VIDEO_DIR = path.resolve(process.cwd(), "video_vault");

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR);
}

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR);
}

if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR);
}

// Configure multer for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGE_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadVideo = multer({ 
  storage: videoStorage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
});

const uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

let userDataCache: any = null;
let mediaDataCache: any = null;

// Helper to read/write data
const readData = () => {
  if (userDataCache) return userDataCache;
  if (fs.existsSync(DATA_FILE)) {
    try {
      userDataCache = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return userDataCache;
    } catch (e) {
      return {};
    }
  }
  return {};
};

const writeData = (data: any) => {
  userDataCache = data;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  } catch (e) {
    console.error("Error writing user data:", e);
  }
};

const readMedia = () => {
  if (mediaDataCache) return mediaDataCache;
  if (fs.existsSync(MEDIA_FILE)) {
    try {
      mediaDataCache = JSON.parse(fs.readFileSync(MEDIA_FILE, "utf-8"));
      return mediaDataCache;
    } catch (e) {
      return { visuals: [], videos: [], defaultBackground: null };
    }
  }
  return { visuals: [], videos: [], defaultBackground: null };
};

const writeMedia = (data: any) => {
  mediaDataCache = data;
  try {
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(data));
  } catch (e) {
    console.error("Error writing media data:", e);
  }
};

// Seeding logic
const seedMedia = () => {
  const existingMedia = readMedia();
  
  console.log("Synchronizing media registry with clinical defaults...");
  const defaultMedia = {
    videos: [
      {
        id: "1",
        title: "Ultrasound Physics Basics",
        description: "A comprehensive overview of sound waves, frequency, and propagation in tissue. Topics include wavelength, speed of sound, and medium properties.",
        citation: "Source: Radiology Tutorials",
        embedUrl: "https://www.youtube.com/embed/xtdfCGz6e1Y",
        thumbnail: "https://img.youtube.com/vi/xtdfCGz6e1Y/hqdefault.jpg",
        duration: "9:07",
        script: "In this session, we investigate the fundamental physics of diagnostic ultrasound. Sound is a mechanical, longitudinal wave that requires a medium to propagate. Frequency, measured in Hertz, determines the pitch of the sound and, in ultrasound, influences axial resolution and penetration depth. Propagation speed in soft tissue is standardized at 1540 meters per second, though it varies significantly in bone or air.",
        assessment: [
          { id: "q1-1", question: "What is the average propagation speed of sound in soft tissue?", options: ["1450 m/s", "1540 m/s", "2000 m/s", "330 m/s"], correctAnswer: 1, explanation: "Standard soft tissue propagation speed is 1540 m/s." },
          { id: "q1-2", question: "Sound is what type of wave?", options: ["Transverse & Electromagnetic", "Mechanical & Longitudinal", "Transverse & Mechanical", "Longitudinal & Electromagnetic"], correctAnswer: 1, explanation: "Sound is a mechanical wave that travels longitudinally through a medium." }
        ]
      },
      {
        id: "2",
        title: "Doppler Ultrasound Principles",
        description: "Understanding the Doppler effect, color flow, and spectral Doppler for hemodynamic analysis.",
        citation: "Source: Radiology Tutorials",
        embedUrl: "https://www.youtube.com/embed/TkjyyzsNpaU",
        thumbnail: "https://img.youtube.com/vi/TkjyyzsNpaU/hqdefault.jpg",
        duration: "22:10",
        script: "Doppler ultrasound is the cornerstone of hemodynamic assessment. By measuring the shift in frequency from moving red blood cells, we can determine velocity and direction of flow. Pulse Repetition Frequency (PRF) is critical; if the Doppler shift exceeds half the PRF, aliasing occurs. This session covers Color Doppler, Power Doppler, and Spectral waveform analysis.",
        assessment: [
          { id: "q2-1", question: "What occurs when the Doppler shift exceeds the Nyquist limit?", options: ["Mirror Imaging", "Enhancement", "Aliasing", "Shadowing"], correctAnswer: 2, explanation: "Aliasing is the wrapping around of the spectral waveform when the PRF is too low." },
          { id: "q2-2", question: "Power Doppler is primarily useful for?", options: ["Measuring high velocities", "Determining flow direction", "Detecting low-velocity flow", "Precise spectral measurement"], correctAnswer: 2, explanation: "Power Doppler is highly sensitive to low flow but does not show direction." }
        ]
      }
    ],
    visuals: [
      {
        id: "v1",
        title: "Physics: Sound Wave Propagation",
        description: "Schematic representation of sound as a mechanical longitudinal wave comprising areas of compression and rarefaction.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png",
        category: "Physics Basics"
      },
      {
        id: "v5",
        title: "Clinical: Normal RUQ Survey",
        description: "Sonographic view of Morison's Pouch showing the liver and right kidney. Note the comparative echogenicity: normal liver parenchyma is typically isoechoic or slightly hyperechoic relative to the renal cortex.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ultrasound_of_the_liver_and_right_kidney.jpg/800px-Ultrasound_of_the_liver_and_right_kidney.jpg",
        category: "Clinical Scans"
      },
      {
        id: "v7",
        title: "Clinical: M-Mode Mitral Valve",
        description: "Motion mode display of the cardiac mitral valve. Demonstrates high temporal resolution, capturing the characteristic 'E' and 'A' peaks of leaflet motion.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mitral_valve_M-mode.jpg/800px-Mitral_valve_M-mode.jpg",
        category: "Clinical Scans"
      },
      {
        id: "v8",
        title: "Clinical: Carotid Bifurcation (B-Mode)",
        description: "High-resolution linear scan of the common carotid artery (CCA) bifurcating into the internal (ICA) and external (ECA) carotid arteries.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Carotid_ultrasound.jpg",
        category: "Clinical Scans"
      },
      {
        id: "v9",
        title: "Artifact: Mirror Image Diaphragm",
        description: "Redundant liver structure appearing deep to the diaphragmatic interface due to extended travel time of the reflected sound beam.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ultrasound_Mirror_artifact.jpg/320px-Ultrasound_Mirror_artifact.jpg",
        category: "Artifacts"
      },
      {
        id: "v20",
        title: "Pathology: Gallstone w/ Shadowing",
        description: "Large, hyperechoic intraluminal stone within the gallbladder showing distinct posterior acoustic shadowing.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gallstone_on_ultrasound.jpg/800px-Gallstone_on_ultrasound.jpg",
        category: "Clinical Scans"
      },
      {
        id: "v21",
        title: "Pathology: Simple Breast Cyst",
        description: "Anechoic fluid-filled structure in the breast demonstrating posterior acoustic enhancement, a key indicator of cystic nature.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Ultrasound_of_a_simple_breast_cyst.png",
        category: "Artifacts"
      },
      {
        id: "v23",
        title: "Artifact: Spectral Doppler Aliasing",
        description: "Wrap-around of the spectral waveform indicating that the recorded velocity exceeds the Nyquist limit.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Aliasing_in_Doppler_ultrasound.jpg/640px-Aliasing_in_Doppler_ultrasound.jpg",
        category: "Doppler"
      },
      {
        id: "v24",
        title: "Artifact: Comet Tail (Adenomyomatosis)",
        description: "Reverberation artifact appearing as a tapering metallic signal, often seen in gallbladder wall pathologies.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Ultrasound_Comet_tail_artifact.jpg/640px-Ultrasound_Comet_tail_artifact.jpg",
        category: "Artifacts"
      },
      {
        id: "v25",
        title: "Clinical: Abdominal Aorta Survey",
        description: "Longitudinal view of the abdominal aorta showing clear visualization of the vessel lumen and wall layers.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Abdominal_aorta_ultrasound.jpg/640px-Abdominal_aorta_ultrasound.jpg",
        category: "Clinical Scans"
      }
    ],
    defaultBackground: existingMedia.defaultBackground || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80"
  };

  const updatedVideos = [...existingMedia.videos];
  defaultMedia.videos.forEach(sv => {
    if (!updatedVideos.some(v => v.id === sv.id)) updatedVideos.push(sv);
  });

  const updatedVisuals = [...existingMedia.visuals];
  defaultMedia.visuals.forEach(sv => {
    const idx = updatedVisuals.findIndex(v => v.id === sv.id);
    if (idx === -1) {
      updatedVisuals.push(sv);
    } else {
      // Update existing if it was a placeholder
      if (updatedVisuals[idx].imageUrl.includes('unsplash') || updatedVisuals[idx].title.includes('Figure')) {
        updatedVisuals[idx] = sv;
      }
    }
  });

  writeMedia({ videos: updatedVideos, visuals: updatedVisuals, defaultBackground: defaultMedia.defaultBackground });
};

async function startServer() {
  const app = express();
  
  // 1. Basic Middlewares FIRST
  app.use(express.json({ limit: "200mb" }));
  app.use(express.urlencoded({ limit: "200mb", extended: true }));

  // Seed on start
  seedMedia();

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Health check - MUST be early
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  io.on('connection', (socket) => {
    console.log('User connected to stream sync:', socket.id);

    socket.on('join-live', (userName) => {
      console.log(`${userName} joined the live suite`);
      socket.broadcast.emit('user-joined', { name: userName });
    });

    socket.on('send-message', (data) => {
      const msg = {
        ...data,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      io.emit('new-message', msg);
    });

    socket.on('send-reaction', (type) => {
      socket.broadcast.emit('new-reaction', type);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from field');
    });
  });

  const PORT = 3000;

  // Sync profile changes to Firestore (Debounced or on specific updates)
  app.use('/image_vault', express.static(IMAGE_DIR));
  app.use('/video_vault', express.static(VIDEO_DIR));

  app.get("/api/podcast/rss", async (req, res) => {
    try {
      const response = await fetch("https://anchor.fm/s/49a6baf0/podcast/rss");
      if (!response.ok) {
         throw new Error(`Failed to fetch rss: ${response.statusText}`);
      }
      const text = await response.text();
      res.set('Content-Type', 'text/xml');
      res.send(text);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/podcast/sonography-lounge", async (req, res) => {
    try {
      const response = await fetch("https://feed.podbean.com/thesonographylounge/feed.xml");
      if (!response.ok) {
         throw new Error(`Failed to fetch rss: ${response.statusText}`);
      }
      const text = await response.text();
      res.set('Content-Type', 'text/xml');
      res.send(text);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/remote-log", (req, res) => {
    const logBatch = `--- CLIENT REMOTE LOG ---\n${JSON.stringify(req.body, null, 2)}\n--------------------------\n`;
    fs.appendFileSync(path.resolve(process.cwd(), 'remote_client_logs.txt'), logBatch);
    res.json({ success: true });
  });

  // API Routes
  app.get("/api/sync/:id", (req, res) => {
    console.log(`GET /api/sync/${req.params.id}`);
    const data = readData();
    res.json(data[req.params.id] || {});
  });

  app.post("/api/sync/:id", (req, res) => {
    console.log(`POST /api/sync/${req.params.id}`);
    const data = readData();
    data[req.params.id] = {
      ...data[req.params.id],
      ...req.body,
      lastUpdated: Date.now()
    };
    writeData(data);
    res.json({ success: true });
  });

  // Media reset to defaults
  app.post("/api/media/reset", (req, res) => {
    const defaults = {
      videos: [
        {
          id: "1",
          title: "Ultrasound Physics Basics",
          description: "A comprehensive overview of sound waves, frequency, and propagation in tissue.",
          citation: "Source: Radiology Tutorials",
          embedUrl: "https://www.youtube.com/embed/xtdfCGz6e1Y",
          thumbnail: "https://img.youtube.com/vi/xtdfCGz6e1Y/hqdefault.jpg",
          duration: "9:07",
          script: "In clinical ultrasound, we use longitudinal mechanical waves. Frequency is determined by the transducer, while propagation speed is determined by the medium. In soft tissue, the average speed is 1540 meters per second. This fundamental property allows us to calculate depth using the range equation.",
          assessment: [
            { id: "q1-1", question: "What is the average propagation speed in soft tissue?", options: ["330 m/s", "1540 m/s", "4080 m/s", "1450 m/s"], correctAnswer: 1, explanation: "1540 m/s is the standard value used by ultrasound systems for depth calculations." },
            { id: "q1-2", question: "Ultrasound frequency is defined as sound above?", options: ["20 Hz", "2,000 Hz", "20,000 Hz", "2 MHz"], correctAnswer: 2, explanation: "Human hearing ends at 20 kHz (20,000 Hz); sound above this is ultrasound." }
          ]
        },
        {
          id: "2",
          title: "Doppler Ultrasound Principles",
          description: "Understanding the Doppler effect, color flow, and spectral Doppler.",
          citation: "Source: Radiology Tutorials",
          embedUrl: "https://www.youtube.com/embed/TkjyyzsNpaU",
          thumbnail: "https://img.youtube.com/vi/TkjyyzsNpaU/hqdefault.jpg",
          duration: "22:10",
          script: "Doppler ultrasound is the cornerstone of hemodynamic assessment. By measuring the shift in frequency from moving red blood cells, we can determine velocity and direction of flow. Pulse Repetition Frequency (PRF) is critical; if the Doppler shift exceeds half the PRF, aliasing occurs. This session covers Color Doppler, Power Doppler, and Spectral waveform analysis.",
          assessment: [
            { id: "q2-1", question: "What occurs when the Doppler shift exceeds the Nyquist limit?", options: ["Mirror Imaging", "Enhancement", "Aliasing", "Shadowing"], correctAnswer: 2, explanation: "Aliasing is the wrapping around of the spectral waveform when the PRF is too low." },
            { id: "q2-2", question: "Power Doppler is primarily useful for?", options: ["Measuring high velocities", "Determining flow direction", "Detecting low-velocity flow", "Precise spectral measurement"], correctAnswer: 2, explanation: "Power Doppler is highly sensitive to low flow but does not show direction." }
          ]
        }
      ],
      visuals: [
        {
          id: "v1",
          title: "Physics: Sound Wave Propagation",
          description: "Schematic representation of sound as a mechanical longitudinal wave comprising areas of compression and rarefaction.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png",
          category: "Physics Basics"
        },
        {
          id: "v5",
          title: "Clinical: Normal RUQ Survey",
          description: "Sonographic view of Morison's Pouch showing the liver and right kidney. Note the comparative echogenicity: normal liver parenchyma is typically isoechoic or slightly hyperechoic relative to the renal cortex.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ultrasound_of_the_liver_and_right_kidney.jpg/800px-Ultrasound_of_the_liver_and_right_kidney.jpg",
          category: "Clinical Scans"
        },
        {
          id: "v7",
          title: "Clinical: M-Mode Mitral Valve",
          description: "Motion mode display of the cardiac mitral valve. Demonstrates high temporal resolution, capturing the characteristic 'E' and 'A' peaks of leaflet motion.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mitral_valve_M-mode.jpg/800px-Mitral_valve_M-mode.jpg",
          category: "Clinical Scans"
        },
        {
          id: "v8",
          title: "Clinical: Carotid Bifurcation (B-Mode)",
          description: "High-resolution linear scan of the common carotid artery (CCA) bifurcating into the internal (ICA) and external (ECA) carotid arteries.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Carotid_ultrasound.jpg",
          category: "Clinical Scans"
        },
        {
          id: "v9",
          title: "Artifact: Mirror Image Diaphragm",
          description: "Redundant liver structure appearing deep to the diaphragmatic interface due to extended travel time of the reflected sound beam.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ultrasound_Mirror_artifact.jpg/320px-Ultrasound_Mirror_artifact.jpg",
          category: "Artifacts"
        },
        {
          id: "v20",
          title: "Pathology: Gallstone w/ Shadowing",
          description: "Large, hyperechoic intraluminal stone within the gallbladder showing distinct posterior acoustic shadowing.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gallstone_on_ultrasound.jpg/800px-Gallstone_on_ultrasound.jpg",
          category: "Clinical Scans"
        },
        {
          id: "v21",
          title: "Pathology: Simple Breast Cyst",
          description: "Anechoic fluid-filled structure in the breast demonstrating posterior acoustic enhancement, a key indicator of cystic nature.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Ultrasound_of_a_simple_breast_cyst.png",
          category: "Artifacts"
        },
        {
          id: "v23",
          title: "Artifact: Spectral Doppler Aliasing",
          description: "Wrap-around of the spectral waveform indicating that the recorded velocity exceeds the Nyquist limit.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Aliasing_in_Doppler_ultrasound.jpg/640px-Aliasing_in_Doppler_ultrasound.jpg",
          category: "Doppler"
        },
        {
          id: "v24",
          title: "Artifact: Comet Tail (Adenomyomatosis)",
          description: "Reverberation artifact appearing as a tapering metallic signal, often seen in gallbladder wall pathologies.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Ultrasound_Comet_tail_artifact.jpg/640px-Ultrasound_Comet_tail_artifact.jpg",
          category: "Artifacts"
        },
        {
          id: "v25",
          title: "Clinical: Abdominal Aorta Survey",
          description: "Longitudinal view of the abdominal aorta showing clear visualization of the vessel lumen and wall layers.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Abdominal_aorta_ultrasound.jpg/640px-Abdominal_aorta_ultrasound.jpg",
          category: "Clinical Scans"
        }
      ],
      defaultBackground: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80"
    };

    mediaDataCache = defaults;
    try {
      fs.writeFileSync(MEDIA_FILE, JSON.stringify(defaults));
      res.json(defaults);
    } catch (e) {
      res.status(500).json({ error: "Failed to reset media data" });
    }
  });

  // Media Management API
  app.get("/api/media", (req, res) => {
    console.log(`GET /api/media`);
    res.json(readMedia());
  });

  app.post("/api/media", (req, res) => {
    console.log(`POST /api/media`);
    writeMedia(req.body);
    res.json({ success: true });
  });

  app.get("/api/audio/:userId/:audioId", (req, res) => {
    const { userId, audioId } = req.params;
    const userPath = path.join(AUDIO_DIR, `${userId}_${audioId}.txt`);
    const sharedPath = path.join(AUDIO_DIR, `shared_${audioId}.txt`);
    if (fs.existsSync(userPath)) {
      res.json({ data: fs.readFileSync(userPath, "utf-8") });
    } else if (fs.existsSync(sharedPath)) {
      res.json({ data: fs.readFileSync(sharedPath, "utf-8") });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.post("/api/audio/:userId/:audioId", (req, res) => {
    const filePath = path.join(AUDIO_DIR, `${req.params.userId}_${req.params.audioId}.txt`);
    fs.writeFileSync(filePath, req.body.data);
    res.json({ success: true });
  });
  
  app.get("/api/images/:userId", (req, res) => {
    const { userId } = req.params;
    const userImageDir = path.join(IMAGE_DIR, userId);
    const sharedImageDir = path.join(IMAGE_DIR, 'shared');
    let allImages: any[] = [];
    if (fs.existsSync(sharedImageDir)) {
      const sharedFiles = fs.readdirSync(sharedImageDir);
      sharedFiles.forEach(file => {
        allImages.push({
          id: file.replace(".txt", ""),
          data: fs.readFileSync(path.join(sharedImageDir, file), "utf-8"),
          isShared: true
        });
      });
    }
    if (userId !== 'shared' && fs.existsSync(userImageDir)) {
      const userFiles = fs.readdirSync(userImageDir);
      userFiles.forEach(file => {
        allImages.push({
          id: file.replace(".txt", ""),
          data: fs.readFileSync(path.join(userImageDir, file), "utf-8"),
          isShared: false
        });
      });
    }
    res.json(allImages);
  });
  
  app.post("/api/images/:userId/:imageId", (req, res) => {
    const { userId, imageId } = req.params;
    console.log(`POST /api/images/${userId}/${imageId}`);
    const userImageDir = path.join(IMAGE_DIR, userId);
    if (!fs.existsSync(userImageDir)) {
      fs.mkdirSync(userImageDir, { recursive: true });
    }
    const filePath = path.join(userImageDir, `${imageId}.txt`);
    fs.writeFileSync(filePath, req.body.data);
    console.log(`Saved image to ${filePath}`);
    res.json({ success: true });
  });
  
  app.delete("/api/images/:userId/:imageId", (req, res) => {
    const filePath = path.join(IMAGE_DIR, req.params.userId, `${req.params.imageId}.txt`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.patch("/api/images/:userId/:imageId", (req, res) => {
    const { userId, imageId } = req.params;
    const { newImageId } = req.body;
    console.log(`PATCH /api/images/${userId}/${imageId} to ${newImageId}`);
    const oldPath = path.join(IMAGE_DIR, userId, `${imageId}.txt`);
    const newPath = path.join(IMAGE_DIR, userId, `${newImageId}.txt`);
    
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${oldPath} to ${newPath}`);
      res.json({ success: true });
    } else {
      console.error(`File not found for rename: ${oldPath}`);
      res.status(404).json({ error: "Not found" });
    }
  });

  // Video Upload & Serving
  app.post("/api/upload-video", uploadVideo.single("video"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ success: true, url: `/api/video/${req.file.filename}` });
  });

  app.post("/api/bulk-upload-videos", (req, res, next) => {
    console.log("Bulk video upload request received. Content-Type:", req.headers['content-type']);
    uploadVideo.array("videos", 50)(req, res, (err) => {
      if (err) {
        console.error("Multer video upload error:", err);
        return res.status(500).json({ 
          error: err.message,
          code: (err as any).code || 'UNKNOWN_ERROR'
        });
      }
      next();
    });
  }, (req, res) => {
    const filesCount = req.files ? (req.files as any).length : 0;
    console.log(`Multer processed ${filesCount} videos`);
    const files = req.files as Express.Multer.File[];
    if (!files || !files.length) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const results = files.map(file => ({
      success: true,
      url: `/api/video/${file.filename}`,
      originalName: file.originalname
    }));
    res.json({ success: true, files: results });
  });

  app.post("/api/bulk-upload-images", (req, res, next) => {
    console.log("Bulk image upload request received. Content-Type:", req.headers['content-type']);
    uploadImages.array("images", 50)(req, res, (err) => {
      if (err) {
        console.error("Multer image upload error:", err);
        return res.status(500).json({ 
          error: err.message,
          code: (err as any).code || 'UNKNOWN_ERROR'
        });
      }
      next();
    });
  }, (req, res) => {
    const filesCount = req.files ? (req.files as any).length : 0;
    console.log(`Multer processed ${filesCount} images`);
    const files = req.files as Express.Multer.File[];
    if (!files || !files.length) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const results = files.map(file => ({
      success: true,
      url: `/api/img/${file.filename}`,
      originalName: file.originalname
    }));
    res.json({ success: true, files: results });
  });

  app.get("/api/img/:name", (req, res) => {
    const filePath = path.join(IMAGE_DIR, req.params.name);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("Not found");
    }
  });

  app.get("/api/video/:name", (req, res) => {
    const filePath = path.join(VIDEO_DIR, req.params.name);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("Not found");
    }
  });

  // ElevenLabs Text-to-Speech Proxy
  app.post("/api/tts", async (req, res) => {
    const { text, voiceId } = req.body;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || "pNInz6obpg8nS77y5p4v"; // Default: Adam

    if (!apiKey) {
      console.error("ElevenLabs API Key is missing");
      return res.status(500).json({ error: "ElevenLabs API key not configured in environment." });
    }

    if (!text) {
      return res.status(400).json({ error: "Text is required for speech generation." });
    }

    try {
      console.log(`ElevenLabs TTS Request: text length ${text.length}, voice ${voiceId || defaultVoiceId}`);
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || defaultVoiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.06,
            use_speaker_boost: true
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("ElevenLabs API Error:", errorData);
        throw new Error(errorData.detail?.message || `ElevenLabs API error: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log(`ElevenLabs TTS Success: Received ${arrayBuffer.byteLength} bytes`);
      
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": arrayBuffer.byteLength,
        "Accept-Ranges": "bytes"
      });
      
      res.send(Buffer.from(arrayBuffer));
    } catch (error: any) {
      console.error("Critical TTS Proxy Error:", error);
      res.status(500).json({ error: error.message || "Internal server error during TTS generation" });
    }
  });

  // Audio Proxy to bypass CORS for Visualizer
  app.get("/api/proxy-stream", (req, res) => {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).send("No URL provided");
    }
    console.log(`Proxying audio: ${url}`);
    
    // We must use http or https depending on the URL
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (response) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      if (response.headers["content-type"]) {
        res.setHeader("Content-Type", response.headers["content-type"]);
      } else {
        res.setHeader("Content-Type", "audio/mpeg");
      }
      
      response.pipe(res);
    });

    request.on('error', (err) => {
      console.error("Proxy error:", err);
      res.status(500).send("Failed to proxy audio stream");
    });

    req.on('close', () => {
      request.destroy();
    });
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Express Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  });

  // Start listening immediately so health checks pass
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  console.log("NODE_ENV:", process.env.NODE_ENV);
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // If serving from dist/server.cjs, the public files could be in the same dir
    // We try to resolve 'dist' from process.cwd() as well
    let distPath = path.resolve(_dirname, "dist");
    if (!fs.existsSync(distPath)) {
      distPath = path.resolve(process.cwd(), "dist");
    }
    if (!fs.existsSync(distPath)) {
      distPath = _dirname; // fallback: we might be inside dist already
    }
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Don't serve index.html for API routes or paths with extensions (likely missing files)
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return res.status(404).send('Not Found');
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

startServer().catch(err => {
  console.error("🔥 FATAL SERVER START ERROR:", err);
});
