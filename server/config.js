import viteConfig from "./vite.config.js";
import constants from "bin/scripts/constants.js";
import { dirname, join } from "node:path"
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const rootDir = dirname(fileURLToPath(import.meta.url));
const { cwd, outDir, viewsFilePath } = constants.files;
const { default: views } = fs.existsSync(viewsFilePath) ? await import(viewsFilePath) : { default: null }

const inputs = {
    index: {
        key: "index",
        file: "index.html"
    }
}

if (viteConfig.build.rollupOptions.input) {

    for (const key in viteConfig.build.rollupOptions.input) {
        inputs[key] = {
            key,
            file: viteConfig.build.rollupOptions.input[key]
        }
    }

}

export default { views, inputs }