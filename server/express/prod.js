import expressServer from './server.js'
import sirv from 'sirv'
import mvpExpressIntegration from "mvpjs/express-integration-prod"
import { join } from "node:path"
const port = process.env.PORT || 3000

const base = process.env.BASE || "/"
const publicDir = process.env.publicDir || "statics"
const publicDirPath = join(process.cwd(), publicDir)

// Create http server

expressServer.app.use(await mvpExpressIntegration())
expressServer.app.use(base, sirv(publicDirPath, { extensions: [] }))

expressServer.run(port)