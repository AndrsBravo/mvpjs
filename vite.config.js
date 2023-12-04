import { defineConfig, splitVendorChunkPlugin } from "vite";
import path from "path";

import { fileURLToPath, URL } from "url";

export default defineConfig({
  test: {
    globals: true
  },
  build: {
    outDir: "build/lib",
    emptyOutDir: true,
    target: "esnext",
    lib: {
      /* entry: ["./mvp.js", "./lib/application/AppImport.js"],*/
      entry: ["./mvp.js", "./lib.js", "./exports/data-sources/EndPointDataSource.js"],
      name: "mvp",
      fileName: `mvp`,
      formats: ["es"],
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL("./lib", import.meta.url)) },
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
