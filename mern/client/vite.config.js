import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Multi-page HTML route resolver middleware
function multiPageRouteResolver() {
  return {
    name: 'multi-page-route-resolver',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        let url = req.url.split('?')[0];
        if (url === '/' || url === '') return next();

        const rootDir = import.meta.dirname;
        const cleanUrl = url.replace(/^\//, '').replace(/\/$/, '');
        const lowerUrl = cleanUrl.toLowerCase();

        // Admin & Dashboard route interceptor
        if (lowerUrl === 'admin' || lowerUrl === 'admin/dashboard' || lowerUrl.startsWith('admin/')) {
          const adminPath = path.join(rootDir, 'admin', 'index.html');
          if (fs.existsSync(adminPath)) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.end(fs.readFileSync(adminPath, 'utf-8'));
          }
        }

        const possiblePaths = [
          path.join(rootDir, cleanUrl, 'index.html'),
          path.join(rootDir, 'public', cleanUrl, 'index.html')
        ];

        for (const filePath of possiblePaths) {
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.end(fs.readFileSync(filePath, 'utf-8'));
          }
        }

        next();
      });
    }
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [react(), multiPageRouteResolver()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        about: path.resolve(import.meta.dirname, 'about/index.html'),
        blog: path.resolve(import.meta.dirname, 'blog/index.html'),
        contact: path.resolve(import.meta.dirname, 'contact/index.html'),
        portfolio: path.resolve(import.meta.dirname, 'portfolio/index.html'),
        admin: path.resolve(import.meta.dirname, 'admin/index.html'),
        notFound: path.resolve(import.meta.dirname, '404.html')
      }
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:5000',
      '/Home': 'http://localhost:5000'
    }
  }
})
