import { validateConfig } from "./ConfigValidation"

export default {
  /**
   * The application's running mode.
   * Can be "development" or "production".
   * This value overrides Vite's mode config.
   * It's set by command 'npm run dev' or 'npm run start'.
   * Can also be set via .env: NODE_ENV
   * @default "development"
   */
  mode: "development",
  /**
   * The root directory of the project.
   * This is the base path for all other relative paths.
   * This path overrides Vite's root config.
   * can also be set via .env: ROOT
   * @default process.cwd()
   */
  root: process.cwd(),
  /**
   * Path to all backend directory
   * Can also be set via .env: SERVER_PATH
   * @default "src/backend"
   */
  serverPath: "src/backend",
  /**
   * Path to all frontend directory
   * Can also be set via .env: CLIENT_PATH
   * @default "src/frontend"
   */
  clientPath: "src/frontend",
  /**
   *  Output directory for build. This is relative to the project root.
   *  Vite will place all built files in this directory.
   *  Can also be set via .env: OUT_DIR
   *  @default "statics/dist"
   */
  outDir: "statics/dist",
  /**
   * Public directory for static assets. This is relative to the project root.
   * Vite will serve files from this directory at the root path during development
   * and include them in the build output.
   * This overrides Vite's publicDir config.
   * Can also be set via .env: PUBLIC_DIR
   * @default "public"
   */
  publicDir: "public",

  /**
   * The port number for the production server.
   * for development server, Vite's port config is used instead.
   * Can also be set via .env: PORT
   * @default 3000
   */

  port: 3000,
  /**
   * Set all vite configuration options here.
   * This object will be merged with the default Vite configuration.
   * Refer to Vite documentation for all available options.
   * @type {import('vite').UserConfig}
   * @default null
   * @example
   * viteConfig: {
   *   server: {
   *     port: 5173,
   *     host: 'localhost',
   *   },
   *   build: {
   *     outDir: 'dist',
   *   },
   * }
   * @see https://vitejs.dev/config/
   */
  viteConfig: null,
  /**
   * Path to a custom Vite configuration file.
   * If provided, this file will be merged with the default Vite configuration.
   * The path should be relative to the project root.
   * Can also be set via .env: VITE_CONFIG_FILE
   * @default null
   */
  viteConfigFile: null,

  http: {},

  cache: {
    enabled: true,
  },
  seo: {
    enabled: true,
  },
}

/**
 * List of mutable configuration keys.
 * These keys can be changed by developers.
 * Developers can modify these values via environment variables or via mvp.config.js file.
 * @type {Record<string, {env:string,type?:string,action?:string,nesting?:[string]}>}
 */
const defaultConfigMutables = {
  mode: { env: "NODE_ENV" },
  root: { env: "ROOT" },
  serverPath: { env: "SERVER_PATH" },
  clientPath: { env: "CLIENT_PATH" },
  outDir: { env: "OUT_DIR" },
  publicDir: { env: "PUBLIC_DIR" },
  port: { env: "PORT", type: "number" },
  viteConfig: { env: "", type: "object" },
  viteConfigFile: { env: "VITE_CONFIG_FILE" },
}

export { defaultConfigMutables, validateConfig }
