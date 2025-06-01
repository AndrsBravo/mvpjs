import { defineConfig } from "vite";
import viteConfigObject from "../vite/vite.config.object.js";

viteConfigObject.appType = "custom";
viteConfigObject.server.middlewareMode = true;

/** @type {import('vite').UserConfig} */
export default defineConfig(viteConfigObject)
