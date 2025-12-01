import { defineConfig } from "vite"
import viteConfigObject from "./vite.config.object.js"

viteConfigObject.server.port = 5173

/** @type {import('vite').UserConfig} user */
export default defineConfig(viteConfigObject)
