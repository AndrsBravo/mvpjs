import { setClientConfig, getServerViews } from "../integration/express-autoload/mvp-express-scanner.js"
import constants from "bin/scripts/constants.js";
export default async function autoLoad(config) {

    const { default: mvpConfig } = await import(process.cwd() + "/mvp.config.js") || { default: {} }

    const { MVP_PARAMS_DIR_PATH, CLIENT_CONFIG_FILE_PATH, CLIENT_PATH, VIEWS_FILE } = constants.FILES;

    await setClientConfig({ clientPath: CLIENT_PATH, clientConfigPath: MVP_PARAMS_DIR_PATH, clientConfiFilePath: CLIENT_CONFIG_FILE_PATH })

    getServerViews({ viewsPath: server, viewsFilePath: MVP_PARAMS_DIR_PATH, viewsFile: VIEWS_FILE });

    return {
        name: "vite:mvp-autoload",
        enforce: "pre",
    }
}