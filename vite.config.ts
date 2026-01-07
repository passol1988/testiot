import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// 下载插件
function downloadPlugin() {
  return {
    name: 'download-plugin',
    configureServer(server: any) {
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
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_PUBLIC_URL,
  plugins: [react(), downloadPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
});
