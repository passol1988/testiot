import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// 下载插件
function downloadPlugin() {
  return {
    name: 'download-plugin',
    configureServer(server: any) {
      // 处理 /api/download 下载请求
      server.middlewares.use('/api/download', (req: any, res: any, next: any) => {
        const filePath = path.join(process.cwd(), 'coze-project.tar.gz');

        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          res.setHeader('Content-Type', 'application/gzip');
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Content-Disposition', 'attachment; filename="coze-project.tar.gz"');

          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'File not found' }));
        }
      });

      // 强制为 /@react-refresh 路径设置正确的响应头
      server.middlewares.use((req: any, res: any, next: any) => {
        const originalWriteHead = res.writeHead;
        res.writeHead = function(...args: any[]) {
          if (req.url === '/@react-refresh' || req.url?.startsWith('/@react-refresh/')) {
            // 强制设置 Content-Type 为 application/javascript
            args[1] = args[1] || {};
            args[1]['Content-Type'] = 'application/javascript; charset=utf-8';
            args[1]['Access-Control-Allow-Origin'] = '*';
            args[1]['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
            args[1]['Access-Control-Allow-Headers'] = 'Content-Type';
            args[1]['Cache-Control'] = 'no-cache, no-store, must-revalidate';
          }
          return originalWriteHead.apply(this, args);
        };
        next();
      });

      // 在 Vite 处理之后，确保 /@react-refresh 的响应头正确
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/@react-refresh' || req.url?.startsWith('/@react-refresh/')) {
          // 在所有中间件完成后，强制设置响应头
          const originalEnd = res.end;
          res.end = function(...args: any[]) {
            if (!res.getHeader('Content-Type') || res.getHeader('Content-Type') === 'text/html') {
              res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            }
            return originalEnd.apply(this, args);
          };
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  // 开发环境始终使用默认的 '/'，不设置 base
  base: '/',
  plugins: [
    react({
      // 配置 babel 插件
      babel: {
        plugins: [],
      },
      // 禁用 HMR 的 preamble，避免在预览环境中出现问题
      include: '**/*.{jsx,tsx}',
    }),
    downloadPlugin()
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    // 配置 HMR 以支持代理环境
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5000,
      clientPort: 5000,
    },
  },
  // 优化预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd', '@ant-design/icons'],
    force: false,
  },
  // 确保正确的解析
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // 确保在预览环境中也能正常工作
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
