const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const checkRoute = require("./routes/check");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = Number(process.env.PORT) || 8080;
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

/**
 * Core middleware for JSON handling and CORS in local development.
 */
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: corsOrigin }));

/**
 * API routes.
 */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "url-health-checker", at: new Date().toISOString() });
});
app.use("/api/check", checkRoute);

/**
 * Static file serving for production:
 * - local build path: ../frontend/dist
 * - container path: ./public
 */
const localDistPath = path.resolve(__dirname, "../frontend/dist");
const containerDistPath = path.resolve(__dirname, "./public");
const staticPath = fs.existsSync(localDistPath) ? localDistPath : containerDistPath;

if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    return res.sendFile(path.join(staticPath, "index.html"));
  });
}

/**
 * Catch-all error handler for unexpected server errors.
 */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`URL Health Checker server running on http://localhost:${port}`);
});
