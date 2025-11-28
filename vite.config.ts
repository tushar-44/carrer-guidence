import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from 'vite-plugin-sitemap';
import { visualizer } from 'rollup-plugin-visualizer';

// Define your routes for the sitemap
const dynamicRoutes = [
  '/',
  '/case-studies/design-platform',
  '/case-studies/advertising-platform',
  '/privacy-policy'
];

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    hmr: {
      overlay: true,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    // Bundle analyzer - only in analyze mode
    process.env.ANALYZE && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    Sitemap({
      hostname: 'https://www.stavrossymeonidis.dev',
      dynamicRoutes,
      exclude: ['/admin', '/private'],
      // Remove the incorrect properties and use the correct ones
      readable: true,
      generateRobotsTxt: true,
      robots: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin/', '/api/', '/private/'],
          crawlDelay: 10,
          cleanParam: 'utm_source&utm_medium&utm_campaign'
        }
      ],
      // If you need to set lastmod for each route, use this format:
      outDir: 'dist'
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'zustand',
      'lucide-react',
    ],
    exclude: ['@react-three/fiber', '@react-three/drei', '@splinetool/react-spline'],
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React - highest priority, smallest bundle
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // Router - needed early
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // UI Components - moderate priority
          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/lucide-react')) {
            return 'ui-components';
          }
          // Supabase - lazy load
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          // Heavy animation libraries - lazy load
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'animations';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer';
          }
          // 3D libraries - lazy load, largest bundles
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules/@react-three')) {
            return 'react-three';
          }
          if (id.includes('node_modules/@splinetool')) {
            return 'spline';
          }
          // Charts - lazy load
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          // Other node_modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext ?? '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext ?? '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  }
});