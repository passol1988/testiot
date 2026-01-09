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

      // 在 Vite 处理之前设置 /@react-refresh 的响应头
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/@react-refresh' || req.url?.startsWith('/@react-refresh/')) {
          // 强制设置响应头，即使后续中间件可能修改它
          const originalWriteHead = res.writeHead;
          res.writeHead = function(...args: any[]) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            return originalWriteHead.apply(this, args);
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
    }),
    downloadPlugin()
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    // 完全禁用 HMR，避免在预览环境中出现问题
    hmr: false,
    // 禁用文件监听，避免热更新相关的问题
    watch: null,
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
});
