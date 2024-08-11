export default {
    dev: async () => await import("./express/dev.js"),
    start: async () => await import("./express/prod.js"),
    build: async () => await import("./build.js")
}