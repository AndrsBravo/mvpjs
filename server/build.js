import { build } from "vite";

import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path";

await build({
    configFile: resolve(dirname(fileURLToPath(import.meta.url)), "vite.config.js")
});