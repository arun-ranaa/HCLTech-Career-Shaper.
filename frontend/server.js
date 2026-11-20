/**
 * Grants Management System - Resilient Frontend Development Server
 * Serves the frontend assets on port 4200 with MIME type resolution,
 * robust error trapping, keep-alive heartbeat, and SPA fallback.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4200;
const PUBLIC_DIR = path.join(__dirname, 'src');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Global exception handlers to prevent unexpected exits
process.on('uncaughtException', (err) => {
  console.error('[GMS Server] Caught exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[GMS Server] Unhandled rejection:', reason);
});

const server = http.createServer((req, res) => {
  req.on('error', (err) => {
    console.warn('[GMS Server] Request error:', err.message);
  });

  res.on('error', (err) => {
    console.warn('[GMS Server] Response error:', err.message);
  });

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0];
  let filePath = path.join(PUBLIC_DIR, reqPath === '/' ? 'index.html' : reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html'); // SPA fallback
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      if (!res.headersSent) {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    }
  });
});

server.on('error', (err) => {
  console.error('[GMS Server] Fatal Server Error:', err.message);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================================`);
  console.log(`  Grants Management System (J18) - Resilient Frontend Server`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  Connected Backend: http://localhost:8080/api/v1`);
  console.log(`=================================================================`);
});

// Keep process active indefinitely
if (process.stdin.isTTY) {
  process.stdin.resume();
}
setInterval(() => {}, 60000); // 1-minute event loop anchor
