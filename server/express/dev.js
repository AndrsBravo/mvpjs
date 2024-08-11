import expressServer from "./server.js"
import mvpExpressIntegration from "mvpjs/express-integration-dev"
import { createServer } from "vite"
import { dirname, join } from "node:path"
import { fileURLToPath } from 'node:url'
import vite from "../viteServer.js"
//const rootDir = dirname(fileURLToPath(import.meta.url));
//const configFile = join(rootDir, "../vite.config.js")

//const vite = await createServer({ configFile })
//const vite = await createServer({ configFile })
expressServer.app.use(vite.middlewares)

expressServer.app.use(await mvpExpressIntegration({ vite }))

// Start http server
expressServer.run(process.env.PORT || 5173)