import { join } from 'node:path'
const CWD = process.cwd();
const NODE_MODULES = "node_modules"
const MVP_PARAMS_DIR = ".mvpjs"
const MVP_PARAMS_DIR_PATH = join(CWD, NODE_MODULES, MVP_PARAMS_DIR)
const CLIENT_CONFIG_FILE = "mvp.client.config.js"
const CLIENT_CONFIG_FILE_PATH = join(MVP_PARAMS_DIR_PATH, CLIENT_CONFIG_FILE)
const VIEWS_FILE = "mvp.views.mjs";
const VIEWS_FILE_PATH = join(MVP_PARAMS_DIR_PATH, VIEWS_FILE);
const SERVER_CONFIG_FILE = "mvp.server.config.mjs";
const SERVER_CONFIG_FILE_PATH = join(MVP_PARAMS_DIR_PATH, SERVER_CONFIG_FILE);
const OUT_DIR = process.env.OUT_DIR || "/dist";
const SERVER_PATH = process.env.SERVER_PATH || "src/server";
const CLIENT_PATH = process.env.CLIENT_PATH || "src/client";

const SCRIPTS =
{
    dev: "mvpjs --dev",
    start: "mvpjs --prod",
    build: "mvpjs --build"
}


export default {
    FILES: {
        CWD,
        OUT_DIR,
        VIEWS_FILE,
        SERVER_PATH,
        CLIENT_PATH,
        NODE_MODULES,
        MVP_PARAMS_DIR,
        VIEWS_FILE_PATH,
        CLIENT_CONFIG_FILE,
        SERVER_CONFIG_FILE,
        MVP_PARAMS_DIR_PATH,
        CLIENT_CONFIG_FILE_PATH,
        SERVER_CONFIG_FILE_PATH,
    },
    NPM: {
        SCRIPTS
    }
}
