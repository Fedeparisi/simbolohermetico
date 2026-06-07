import app from "./api/index.js";
import path from "path";
import express from "express";

const PORT = 3000;

if (!process.env.VERCEL && !process.env.IS_DEV_SERVER) {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Hermetic Server] Escuchando en el plano terrenal (http://localhost:${PORT})`);
  });
}

export default app;
