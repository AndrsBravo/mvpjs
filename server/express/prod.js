import sirv from 'sirv'
import { join } from "node:path"
import expressServer from './server.js'
import mvpExpressIntegration from "mvpjs/express-integration-prod"

const port = process.env.PORT || 3000
const base = process.BASE || "/"
const outDir = process.env.outDir || "dist"
const outDirPath = join(process.cwd(), outDir)

// Create http server

expressServer.app.use(await mvpExpressIntegration())
expressServer.app.use(base, sirv(outDirPath, { extensions: [] }))

expressServer.run(port)