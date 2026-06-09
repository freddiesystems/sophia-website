/**
 * Tiny zero-dependency static file server.
 * Only used for local preview — the site itself is plain static files,
 * so it deploys for free to Netlify, Vercel, GitHub Pages or Cloudflare Pages.
 *
 *   npm run dev   →  http://localhost:4324
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4324;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

http
  .createServer((req, res) => {
    let url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/") url = "/index.html";
    const filePath = path.join(ROOT, path.normalize(url));

    // Prevent path traversal outside the project root.
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        return res.end("<h1>404 — not found</h1>");
      }
      const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log("Sophia Roth site running on http://localhost:" + PORT));
