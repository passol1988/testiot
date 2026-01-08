import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || process.env.DEPLOY_RUN_PORT || 5000;
const distDir = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

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
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found' }));
    }
    return;
  }

  // 忽略 Vite 开发服务器的内部路径
  if (req.url?.startsWith('/@')) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 - 页面不存在</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>404 - 页面不存在</h1>
        <p>您访问的是开发环境的内部路径，该路径在生产环境中不存在。</p>
        <p><a href="/">点击这里返回首页</a></p>
      </body>
      </html>
    `);
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
            res.writeHead(404);
            res.end('Not Found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(fallbackContent, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // 对于文本文件使用 utf-8 编码，对于二进制文件不指定编码
      const isTextFile = ['.html', '.css', '.js', '.json', '.svg'].includes(extname);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, isTextFile ? 'utf-8' : undefined);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});
