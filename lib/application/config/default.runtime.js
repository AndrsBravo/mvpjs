/**
 * This configuration file is private and is used by the system.
 * It contains settings that are not meant to be modified by developers.
 * These settings are used internally by the application.
 * Developers should not change these values.
 * @private
 *
 */
export default {
  cwd: process.cwd(),
  /**
   * This file contains all runtime configurations.
   * It s private and can not be change for de user.
   * @private
   * @default "mvpjs.runtime.js"
   */
  configFile: "mvpjs.runtime.js",
  /**
   * This is the config file name.
   * user can modify and has to specify the new name as a command param:
   * Param options '--config <file_name.js>, -f <file_name.js>'
   *
   * @example
   * mvpjs --dev --config <file_name.js>
   * mvpjs --dev --f <file_name.js>
   * mvpjs --start --config <file_name.js>
   * mvpjs --start --f <file_name.js>
   *
   * @default  "mvp.config.js"
   */
  userConfigFile: "mvp.config.js",

  /**
   * The runtime mode of the application.
   * Can be set to "fullstack" or "frontend".
   * @default "fullstack"
   */
  mode: "fullstack",
  /**
   * The directory where the runtime files are stored.
   * This is relative to the project root.
   * @default "node_modules/.mvpjs"
   */
  dir: "node_modules/.mvpjs",
  /**
   * The filename for the client runtime configuration.
   * @default "mvpjs.client.config.js"
   */
  clientFile: "mvpjs.client.config.js",
  /**
   * The filename for the server runtime configuration.
   * @default "mvpjs.server.config.mjs"
   */
  serverFile: "mvpjs.server.config.mjs",

  scrips: {
    dev: "mvpjs --dev",
    start: "mvpjs --prod",
    build: "mvpjs --build",
  },
}
