const { defineConfig } = require("vite");
const path = require("path");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/mvp.js"),
      name: "mvp",
      fileName: (format) => `mvp.${format}.js`,
      formats: ["es"],
    },
  },
  resolve: {
    alias: {
      "/@": path.resolve(__dirname, "./lib"),
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
