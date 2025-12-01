import expressServer from "./server.js"
import mvpExpressIntegration from "../integration/express-integration/express-integration-dev.js"
import vite from "../vite/viteServer.js"
expressServer.app.use(vite.middlewares)
expressServer.app.use(await mvpExpressIntegration({ vite }))
expressServer.app.use(base, sirv(publicDirPath, { extensions: [] }))

// Start http server
expressServer.run(process.env.PORT || 5173)
