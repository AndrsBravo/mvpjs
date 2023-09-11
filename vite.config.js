import { defineConfig, splitVendorChunkPlugin } from "vite";
import path from "path";

import { fileURLToPath, URL } from "url";

export default defineConfig({
  test:{
    globals:true
  },
  build: {
    outDir: "build/lib",
    emptyOutDir: true,
    target: "esnext",
    lib: {
      entry: ["./mvp.js", "./lib/application/AppImport.js"],
      name: "mvp",
      fileName: `mvp`,
      formats: ["es"],
    },

  },

  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL("./lib", import.meta.url)) },
      { find: '@core', replacement: fileURLToPath(new URL("./lib/core", import.meta.url)) },
      { find: '@view', replacement: fileURLToPath(new URL("./lib/mvp/view", import.meta.url)) },
      { find: '@page', replacement: fileURLToPath(new URL("./lib/mvp/page", import.meta.url)) }
    ]
  }

});

/*

 build: {
    emptyOutDir: true,

    rollupOptions: {
      input: path.resolve(__dirname, "lib/mvp.js"),
    },
  },

 */
