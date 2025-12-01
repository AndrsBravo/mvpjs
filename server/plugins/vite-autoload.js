import { getServerViews } from "server/integration/express-autoload/mvp-express-scanner.js"
import { setClientConfig } from "server/integration/client-integration/clientConfig.js"
import constants from "bin/scripts/constants.js"
export default async function autoLoad(config) {
  const { default: mvpConfig } = (await import(
    process.cwd() + "/mvp.config.js"
  )) || { default: {} }

  const { MVP_RUNTIME_DIR, CLIENT_CONFIG_FILE_PATH, CLIENT_PATH, VIEWS_FILE } =
    constants.FILES

  await setClientConfig({
    clientPath: CLIENT_PATH,
    clientConfigPath: MVP_RUNTIME_DIR,
    clientConfiFilePath: CLIENT_CONFIG_FILE_PATH,
  })

  getServerViews({
    viewsPath: server,
    viewsFilePath: MVP_RUNTIME_DIR,
    viewsFile: VIEWS_FILE,
  })

  return {
    name: "vite:mvp-autoload",
    enforce: "pre",
  }
}
