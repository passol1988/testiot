import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000;
const distDir = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

let rebuildTimeout = null;

// 重新构建项目
function rebuildProject() {
  if (rebuildTimeout) {
    clearTimeout(rebuildTimeout);
  }

  rebuildTimeout = setTimeout(() => {
    console.log(`[${new Date().toISOString()}] Rebuilding project...`);
    const rebuildProcess = spawn('pnpm', ['run', 'build'], {
      cwd: __dirname,
      stdio: 'inherit',
    });
    rebuildProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`[${new Date().toISOString()}] Rebuild completed. Refresh the page to see changes.`);
      } else {
        console.error(`[${new Date().toISOString()}] Rebuild failed with code ${code}`);
      }
    });
  }, 1500); // 防抖 1.5 秒
}

// 先构建项目
console.log(`[${new Date().toISOString()}] Building project...`);
const buildProcess = spawn('pnpm', ['run', 'build'], {
  cwd: __dirname,
  stdio: 'inherit',
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`[${new Date().toISOString()}] Build failed with code ${code}`);
    process.exit(1);
  }

  console.log(`[${new Date().toISOString()}] Build completed. Starting preview server...`);

  const server = http.createServer((req, res) => {
    // 处理文件下载请求
    if (req.url === '/api/download' && req.method === 'GET') {
      const filePath = path.join(__dirname, 'coze-project.tar.gz');
      const fileName = 'coze-project.tar.gz';

      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        res.writeHead(200, {
          'Content-Type': 'application/gzip',
          'Content-Length': stat.size,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        });

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'File not found' }));
      }
      return;
    }

    let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);

    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          // 如果文件不存在，返回 index.html (SPA 路由回退)
          fs.readFile(path.join(distDir, 'index.html'), (err, fallbackContent) => {
            if (err) {
              res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
              res.end('Not Found');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallbackContent, 'utf-8');
          });
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`Server Error: ${error.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[${new Date().toISOString()}] Preview server running at http://0.0.0.0:${PORT}/`);
    console.log(`[${new Date().toISOString()}] Watching for changes in src directory...`);
  });

  // 监听文件变化，自动重新构建
  const watchPath = path.join(__dirname, 'src');
  if (fs.existsSync(watchPath)) {
    fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith('.tsx') || filename.endsWith('.ts') || filename.endsWith('.css'))) {
        console.log(`[${new Date().toISOString()}] Detected changes in ${filename}`);
        rebuildProject();
      }
    });
  }
});
