import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "user_data.json");
const AUDIO_DIR = path.join(process.cwd(), "audio_vault");
const IMAGE_DIR = path.join(process.cwd(), "image_vault");

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR);
}

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR);
}

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use((req, res, next) => {
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      console.log(`Large request received: ${req.method} ${req.url} - ${contentLength} bytes`);
    }
    next();
  });

  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));

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

  app.get("/api/audio/:userId/:audioId", (req, res) => {
    const filePath = path.join(AUDIO_DIR, `${req.params.userId}_${req.params.audioId}.txt`);
    if (fs.existsSync(filePath)) {
      const base64 = fs.readFileSync(filePath, "utf-8");
      res.json({ data: base64 });
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
    const userImageDir = path.join(IMAGE_DIR, req.params.userId);
    if (!fs.existsSync(userImageDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(userImageDir);
    const images = files.map(file => {
      const data = fs.readFileSync(path.join(userImageDir, file), "utf-8");
      return { id: file.replace(".txt", ""), data };
    });
    res.json(images);
  });
  
  app.post("/api/images/:userId/:imageId", (req, res) => {
    const userImageDir = path.join(IMAGE_DIR, req.params.userId);
    if (!fs.existsSync(userImageDir)) {
      fs.mkdirSync(userImageDir, { recursive: true });
    }
    const filePath = path.join(userImageDir, `${req.params.imageId}.txt`);
    fs.writeFileSync(filePath, req.body.data);
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
