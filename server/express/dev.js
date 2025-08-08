import expressServer from "./server.js"
import mvpExpressIntegration from "mvpjs/express-integration-dev"
import vite from "../viteServer.js"
expressServer.app.use(vite.middlewares)

expressServer.app.use(await mvpExpressIntegration({ vite }))

// Start http server
expressServer.run(process.env.PORT || 5173)