import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { Server } from "socket.io";
import { createServer } from "http";
import https from "https";
import http from "http";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.resolve(__dirname, "user_data.json");
const MEDIA_FILE = path.resolve(__dirname, "media_data.json");
const AUDIO_DIR = path.resolve(__dirname, "audio_vault");
const IMAGE_DIR = path.resolve(__dirname, "image_vault");
const VIDEO_DIR = path.resolve(__dirname, "video_vault");

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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
});

// Helper to read/write data
const readData = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (e) {
      return {};
    }
  }
  return {};
};

const writeData = (data: any) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const readMedia = () => {
  if (fs.existsSync(MEDIA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(MEDIA_FILE, "utf-8"));
    } catch (e) {
      return { visuals: [], videos: [] };
    }
  }
  return { visuals: [], videos: [] };
};

const writeMedia = (data: any) => {
  fs.writeFileSync(MEDIA_FILE, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
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

  // 1. Health check endpoint - MUST be defined before everything
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use(express.json({ limit: "200mb" }));
  app.use(express.urlencoded({ limit: "200mb", extended: true }));

  // Socket.io Logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    socket.on("join-live", (userName) => {
      socket.broadcast.emit("user-joined", { id: socket.id, name: userName });
      console.log(`${userName} joined the live session`);
    });

    socket.on("send-message", (messageData) => {
      io.emit("new-message", {
        ...messageData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      });
    });

    socket.on("send-reaction", (reaction) => {
      socket.broadcast.emit("new-reaction", reaction);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // API Routes
  app.get("/api/user/:id", (req, res) => {
    const data = readData();
    res.json(data[req.params.id] || {});
  });

  app.post("/api/user/:id", (req, res) => {
    const data = readData();
    data[req.params.id] = {
      ...data[req.params.id],
      ...req.body,
      lastUpdated: Date.now()
    };
    writeData(data);
    res.json({ success: true });
  });

  // Media Management API
  app.get("/api/media", (req, res) => {
    res.json(readMedia());
  });

  app.post("/api/media", (req, res) => {
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
  app.post("/api/upload-video", upload.single("video"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ success: true, url: `/api/video/${req.file.filename}` });
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
      return res.status(500).json({ error: "ElevenLabs API key not configured in environment." });
    }

    if (!text) {
      return res.status(400).json({ error: "Text is required for speech generation." });
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || defaultVoiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || "ElevenLabs API error");
      }

      // Stream the audio back to the client
      const arrayBuffer = await response.arrayBuffer();
      res.set("Content-Type", "audio/mpeg");
      res.send(Buffer.from(arrayBuffer));
    } catch (error: any) {
      console.error("TTS Error:", error);
      res.status(500).json({ error: error.message });
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  // Start listening only after all middlewares are ready
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
