import { getClientRoutesObject, getServerViews } from "./express-autoload/mvp-express-scanner.js"
import constants from "bin/scripts/constants.js";
export default async function autoLoad(config) {

    const { mvpPath: clientRoutePath, clientRouteFilePath, clientPath, serverViewsPath, viewsFile } = constants.files;

    await getClientRoutesObject({ clientRoutePath, clientRouteFilePath, clientPath })

    getServerViews({ viewsPath: serverViewsPath, viewsFilePath: clientRoutePath, viewsFile });


    return {
        name: "vite:mvp-autoload",
        enforce: "pre",
    }
}