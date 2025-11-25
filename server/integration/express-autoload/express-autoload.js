import { getServerMiddleWare, scanDir } from "./mvp-express-scanner.js";
import constants from "bin/scripts/constants.js";

export default async function expressAutoLoad(config) {

    const { SERVER_PATH } = constants.FILES;
    const serverModules = await scanDir(SERVER_PATH)
    const serverMiddleWare = await getServerMiddleWare(serverModules)

    return serverMiddleWare;

}