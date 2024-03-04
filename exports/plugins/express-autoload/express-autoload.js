import { getServerMiddleWare, scanDir } from "./mvp-express-scanner.js";
import { join } from "path"
export default async function autoLoad(config) {

    const cwd = config.cwd || process.cwd();

    const serverDir = config.serverDir || "/backend/server"
    const serverPath = join(cwd, serverDir);
    const serverModules = await scanDir(serverPath)
    const serverMiddleWare = await getServerMiddleWare(serverModules, config.express)

    return serverMiddleWare;

}