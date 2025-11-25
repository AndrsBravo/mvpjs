import viteConfig from "./vite.config.js";
import constants from "bin/scripts/constants.js";
import { dirname, join } from "node:path"
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const rootDir = dirname(fileURLToPath(import.meta.url));
const { CWD, OUT_DIR, VIEWS_FILE_PATH } = constants.FILES;
const { default: views } = fs.existsSync(VIEWS_FILE_PATH) ? await import(VIEWS_FILE_PATH) : { default: null }

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