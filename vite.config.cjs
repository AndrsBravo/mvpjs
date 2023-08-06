const { defineConfig, splitVendorChunkPlugin } = require("vite");
const path = require("path");

module.exports = defineConfig({
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

});

/*

 build: {
    emptyOutDir: true,

    rollupOptions: {
      input: path.resolve(__dirname, "lib/mvp.js"),
    },
  },

 */
