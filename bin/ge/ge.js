#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import { resolve, dirname } from "path"

const processPath = resolve(dirname(fileURLToPath(import.meta.url)), "../");
const cwd = process.cwd();

//console.log(process.argv.slice(2));

const [option] = process.argv.slice(2);

//import "../server.js"

const strategy = {
    dev: async () => await import("../server/devServer.js"),
    start: async () => await import("../server/server.js"),
    build: async () => await import("../server/build.js")
}

await strategy[option]();