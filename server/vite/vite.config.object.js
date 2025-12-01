import { viteHtmlTemplate } from "../plugins/vite-html-template.js"
import viteAutoLoad from "../plugins/vite-autoload.js"
import { resolve } from "node:path"

/**@type {import("node_modules/vite/dist/node/index.js").UserConfig} */
export default {
  base: "/",
  root: process.cwd(),
  server: {
    fs: {
      allow: [
        resolve(process.cwd()),
        resolve(process.cwd(), "src"),
        resolve(process.cwd(), "frontend"),
        resolve(process.cwd(), "node_modules", ".mvpjs"),
      ],
    },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    target: "esnext",
    outDir: "dist",
    modulePreload: true,
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: { index: "./index.html" },
      output: {
        assetFileNames: "[name].[ext]",
        chunkFileNames: "[name].js",
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [viteAutoLoad(), viteHtmlTemplate()],
  resolve: {
    alias: [
      { find: "@app", replacement: resolve(process.cwd(), "frontend", "app") },
      {
        find: "@client",
        replacement: resolve(process.cwd(), "frontend", "client"),
      },
    ],
  },
}
