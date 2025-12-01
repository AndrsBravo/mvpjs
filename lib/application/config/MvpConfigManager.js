import dotenv from "dotenv"
import { resolve } from "node:path"
import loadModules from "shared/utils/loadModules"
import logger from "shared/utils/logger"
import defaultConfig, {
  defaultConfigMutables,
  validateConfig,
} from "./default.config"

/**
 * MvpConfigManager - Singleton Configuration Manager
 *
 * Merges configuration from three sources in order:
 * 1. Default configuration (default.config.js)
 * 2. Environment variables (.env files)
 * 3. User configuration (mvp.config.js)
 *
 * Only properties marked as modifiable by user can be changed.
 * Private properties cannot be modified from mvp.config.js.
 */
export class MvpConfigManager {
  #environment = process.env.NODE_ENV || "development"
  #mergedConfig = {}
  #userConfig = {}
  #envVariables = {}

  static #instance = null

  constructor() {
    this.#loadUserConfig()
    this.#loadEnvironmentVariables()
    this.#mergeConfiguration()
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!MvpConfigManager.#instance) {
      MvpConfigManager.#instance = new MvpConfigManager()
    }
    return MvpConfigManager.#instance
  }

  /**
   * Load environment variables from .env files
   */
  #loadEnvironmentVariables() {
    const projectRoot = defaultRuntime.cwd

    // Load .env file
    const envPath = resolve(projectRoot, ".env")
    const envResult = dotenv.config({ path: envPath })

    // Load environment-specific .env file
    const envSpecificPath = resolve(projectRoot, `.env.${this.#environment}`)
    const envSpecificResult = dotenv.config({ path: envSpecificPath })

    // Merge all environment variables (specific overrides general)
    this.#envVariables = {
      ...envResult.parsed,
      ...envSpecificResult.parsed,
      ...process.env,
    }
  }

  /**
   * Merge configuration from all sources
   * Order: defaults → env variables → user config
   */
  #mergeConfiguration() {
    // Start with default config
    this.#mergedConfig = JSON.parse(JSON.stringify(defaultConfig))

    // Apply environment variable overrides
    this.#applyEnvironmentVariables()

    // Merge user config from mvp.config.js
    this.#deepMergeUserConfig()
  }

  /**
   * Load user configuration from mvp.config.js
   */
  async #loadUserConfig() {
    const configPath = resolve(
      defaultRuntime.cwd,
      defaultRuntime.userConfigFile,
    )
    const userConfig = await loadModules(configPath)

    const validated = await validateConfig(userConfig)

    if (validated.error) return logger.error(validated.error)

    this.#userConfig = validated.input
  }

  /**
   * Deep merge objects
   */

  #deepMergeUserConfig() {
    if (!this.#mergedConfig) return

    const mergedConfig = this.#mergedConfig

    const fn = {
      default: (propertyInfo) => {
        const key = propertyInfo.nesting[0]
        if (!Object.hasOwn(mergedConfig, key)) return
        if (!Object.hasOwn(userConfig, key)) return
        let userData = userConfig
        let defaultData = mergedConfig
        let i = 1
        while (i < propertyInfo.nesting.length) {
          const nestedKey = propertyInfo.nesting[i - 1]
          if (!Object.hasOwn(defaultData, nestedKey)) return
          if (!Object.hasOwn(userData, nestedKey)) return
          defaultData = defaultData[nestedKey]
          userData = userData[nestedKey]
          i++
        }

        defaultData[key] = userData[key]
      },
      array: (propertyInfo) => {
        const key = propertyInfo.configKey
        /**
         * Handle non-nested array properties
         * This is necessary because arrays are not objects
         * and cannot be traversed like nested objects
         * the action could be "set" o "append" .
         *  */
        if (!propertyInfo.nesting || propertyInfo.nesting.length < 1) {
          if (!Object.hasOwn(mergedConfig, key)) return
          if (!Object.hasOwn(userConfig, key)) return

          if (propertyInfo.action === "set") {
            mergedConfig[key] = userConfig[key]
            return
          }
          if (propertyInfo.action === "append") {
            mergedConfig[key].push(...userConfig[key])
            return
          }
          return
        }

        if (!Object.hasOwn(mergedConfig, key)) return
        if (!Object.hasOwn(userConfig, key)) return
        let userData = userConfig
        let defaultData = mergedConfig
        let i = 1
        while (i < propertyInfo.nesting.length) {
          const nestedKey = propertyInfo.nesting[i - 1]
          if (!Object.hasOwn(defaultData, nestedKey)) return
          if (!Object.hasOwn(userData, nestedKey)) return
          defaultData = defaultData[nestedKey]
          userData = userData[nestedKey]
          i++
        }

        if (propertyInfo.action === "set") {
          defaultData[key] = userData[key]
          return
        }
        if (propertyInfo.action === "append") {
          defaultData[key].push(...userData[key])
          return
        }
      },
      object: (propertyInfo) => {
        for (const key of propertyInfo.nesting) {
          if (!Object.hasOwn(mergedConfig, key)) return
          if (!Object.hasOwn(userConfig, key)) return
        }
      },
    }

    for (const configKey in defaultConfigMutables) {
      const property = defaultConfigMutables[configKey]
      const propertyInfo = {
        configKey,
        type: property.type || "default",
        action: property.action || "set",
        nesting: property.nesting || [configKey],
      }

      if (propertyInfo.nesting.length === 1) {
        if (!Object.hasOwn(mergedConfig, configKey)) continue
        if (!Object.hasOwn(userConfig, configKey)) continue
      }

      if (propertyInfo.nesting.length === 1 && propertyInfo.action === "set") {
        mergedConfig[configKey] = userConfig[configKey]
      }

      /* if (!fn.hasOwnProperty(propertyInfo.type)) fn.default(propertyInfo);
      fn[propertyInfo.type](propertyInfo);
      */
    }
  }

  /**
   * Apply environment variable overrides to config
   */
  #applyEnvironmentVariables() {
    if (!this.#mergedConfig) return

    for (const configKey in defaultConfigMutables) {
      const property = defaultConfigMutables[configKey]
      const envKey = property.env
      if (!defaultConfigMutables[configKey]) continue
      if (!Object.hasOwn(this.#mergedConfig, configKey)) continue
      if (!Object.hasOwn(this.#envVariables, envKey)) continue
      this.#mergedConfig[configKey] = this.#envVariables[envKey]
    }
  }

  /**
   * Get the complete merged configuration
   * @returns {Object} The merged configuration
   */
  getMergedConfig() {
    return JSON.parse(JSON.stringify(this.#mergedConfig))
  }

  /**
   * Validate the configuration
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = []

    // Validate mode
    if (
      this.#mergedConfig.mode &&
      !["development", "production"].includes(this.#mergedConfig.mode)
    ) {
      errors.push('Mode must be "development" or "production"')
    }

    // Validate port
    if (
      this.#mergedConfig.port &&
      (typeof this.#mergedConfig.port !== "number" ||
        this.#mergedConfig.port < 1 ||
        this.#mergedConfig.port > 65535)
    ) {
      errors.push("Port must be a number between 1 and 65535")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

export default MvpConfigManager
