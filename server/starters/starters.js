const commands = {

    dev: async () => await import("../vite/dev.js"),
    build: async () => await import("../vite/build.js"),
    fullStackDev: async () => await import("../express/dev.js"),
    fullStackStart: async () => await import("../express/prod.js"),

}

export default {
    dev: commands.fullStackDev,
    start: async () => await import("../express/prod.js"),
    build: async () => await import("../vite/build.js")
}
