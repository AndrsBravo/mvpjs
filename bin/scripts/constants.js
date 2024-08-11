import { join } from 'node:path'
const cwd = process.cwd();
const node = "node_modules"
const mvpFile = ".mvpjs"
const mvpPath = join(cwd, node, mvpFile)
const serverDir = process.env.SERVER_DIR || "/backend/server";
const serverPath = join(cwd, serverDir);
const clientDir = process.env.CLIENT_DIR || "/frontend/client"
const clientPath = join(cwd, clientDir);
const clientRouteFile = "mvp.routes.js"
const clientRouteFilePath = join(mvpPath, clientRouteFile)
const viewsFile = "mvp.views.mjs";
const viewsFilePath = join(mvpPath, viewsFile);
const serverViewsDir = process.env.SERVER_VIEWS || "/backend/server/views"
const serverViewsPath = join(cwd, serverViewsDir);
const outDir = process.env.outDir || "/dist";

const scripts =
{
    dev: "mvpjs --dev",
    start: "mvpjs --prod",
    build: "mvpjs --build"
}


export default {
    files: {
        cwd,
        node,
        mvpFile,
        mvpPath,
        serverDir,
        serverPath,
        clientDir,
        clientRouteFilePath,
        clientPath,
        serverViewsDir,
        serverViewsPath,
        viewsFile,
        viewsFilePath
    },
    npm: {
        scripts
    }
}
