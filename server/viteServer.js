import { createServer } from "vite"
import { dirname, join } from "node:path"
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url));
const configFile = join(rootDir, "./vite.config.js")

const vite = await createServer({ configFile })
export default vite