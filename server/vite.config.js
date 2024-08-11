import { defineConfig } from "vite";
import { viteHtmlTemplate } from "mvpjs/vite-template";
import viteAutoLoad from "mvpjs/vite-autoload";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const { default: mvpConfig } = await import(process.cwd() + "/mvp.config.js") || { default: {} }

////console.log("---llamando el config");

export default defineConfig({

  base: process.env.BASE || '/',
  root: process.cwd(),
  appType: "custom",
  server: {
    middlewareMode: true
  },
  optimizeDeps: {
    force: true
  },
  build: {

    target: "esnext",
    outDir: process.env.outDir || "./dist",
    modulePreload: false,
    emptyOutDir: true,
    rollupOptions: {

      input: {
        index: "./index.html",
        ...mvpConfig.input
      },

      output: {
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js'
      }
    }
  },

  plugins: [
    viteAutoLoad(),
    viteHtmlTemplate(),
  ],

  resolve: {
    alias: [
      { find: '@app', replacement: resolve(process.cwd(), "frontend", "app") },
      { find: '@client', replacement: resolve(process.cwd(), "frontend", "client") },
      { find: 'lib', replacement: resolve(dirname(fileURLToPath(import.meta.url)), "../lib") }
    ]
  }
});