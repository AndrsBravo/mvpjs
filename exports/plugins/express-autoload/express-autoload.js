import { getServerMiddleWare, scanDir } from "./mvp-express-scanner.js";
import constants from "bin/scripts/constants.js";

export default async function autoLoad(config) {

    const { serverPath } = constants.files;
    const serverModules = await scanDir(serverPath)
    const serverMiddleWare = await getServerMiddleWare(serverModules)

    return serverMiddleWare;

}