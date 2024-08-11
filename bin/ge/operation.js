const operations = {
    dev: async () => await import("../../server/express/dev.js"),
    start: async () => await import("../../server/express/prod.js"),
    build: async () => await import("../../server/build.js")
}

export default operations 