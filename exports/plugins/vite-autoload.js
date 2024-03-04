import { join } from "path"
import { getClientRoutesObject, getServerViews } from "./express-autoload/mvp-express-scanner.js"
export default async function autoLoad(config) {

    const cwd = config?.cwd || process.cwd();

    const clientRouteFile = "mvp.routes.js"
    const mvpHiddenFolder = ".mvpjs"

    const clientRoutePath = join(cwd, "node_modules", mvpHiddenFolder)
    const clientRouteFilePath = join(clientRoutePath, clientRouteFile)

    const clientDir = config?.clientDir || "/frontend/client"
    const clientPath = join(cwd, clientDir);

    await getClientRoutesObject({ clientRoutePath, clientRouteFilePath, clientPath })


    const serverViewsDir = config?.serverViewsDir || "/backend/server/views"
    const serverViewsPath = join(cwd, serverViewsDir);

    getServerViews({ viewsPath: serverViewsPath, viewsFilePath: clientRoutePath, viewsFile: "mvp.views.mjs" });


    return {
        name: "vite:mvp-autoload",
        enforce: "pre",
    }
}