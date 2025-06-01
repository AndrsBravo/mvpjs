import sirv from 'sirv'
import { createServer } from "vite"
import { dirname, join } from "node:path"
import { fileURLToPath } from 'node:url'
import expressServer from "./server.js"
import mvpExpressIntegration from "../integration/express-integration/express-integration-dev.js"

const rootDir = dirname(fileURLToPath(import.meta.url));
const configFile = join(rootDir, "./vite.config.js")
const vite = await createServer({ configFile })

const base = process.BASE || "/"
const outDir = process.env.outDir || "dist"
const outDirPath = join(process.cwd(), outDir)

expressServer.app.use(vite.middlewares)
expressServer.app.use(await mvpExpressIntegration({ vite }))
expressServer.app.use(base, sirv(outDirPath, { extensions: [] }))

// Start http server
expressServer.run(process.env.PORT || 5173)