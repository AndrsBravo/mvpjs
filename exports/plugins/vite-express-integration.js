import fs from 'node:fs'
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from 'node:url'
import formatTemplate from "lib/mvp/view/render/formatTemplate.js"
import mvpSsr from "lib/mvp/ssr/ssRender.js"

export default async (config) => {

    const rootDir = dirname(fileURLToPath(config.url));
    const configFile = rootDir + "/vite.config.js"
    // console.log("----------rootDir", rootDir);
    //  console.log("configFile:", configFile);
    const cwd = process.cwd();
    const isProduction = process.env.NODE_ENV === 'production'
    const base = process.env.BASE || '/'

    const { default: viteConfig } = await import(configFile);

    const viewsPath = join(cwd, "node_modules", ".mvpjs", "mvp.views.mjs")

    const { default: views } = fs.existsSync(viewsPath) ? await import(viewsPath) : { default: null }

    const outDir = viteConfig.build.outDir || "./dist"

    const assetsPath = isProduction ? outDir : "./frontend/public/"

    const indexFile = `${cwd}/${viteConfig?.build?.rollupOptions?.input?.index || "index.html"}`

    const middleWares = []

    let vite

    //  console.log("Agregando el middleware");

    const server = async () => {
        const { createServer } = viteConfig;
        vite = await createServer({ configFile })
        return vite.middlewares

    }

    if (!isProduction) middleWares.push(await server())

    const mvpMiddleWare = async (req, res, next) => {

        async function devSend(template) {

            try {

                const url = req.originalUrl.replace(base, '')

                let rendered = await vite.transformIndexHtml(url, template)

                // render = (await vite.ssrLoadModule('/src/entry-server.js')).render
                //  render = (await vite.ssrLoadModule('../../lib/mvp/view/render/formatTemplate.js')).render

                //  const rendered = await render(url, ssrManifest)


                res.status(200).set({ 'Content-Type': 'text/html' }).end(rendered)
                console.log("Respuesta enviada");
            } catch (e) {
                vite?.ssrFixStacktrace(e)
                res.status(500).end(e.stack)
                return;
            }

        }

        async function prodSend(template) {

            try {

                //  const rendered = await render(url, ssrManifest)            
                res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
                console.log("Respuesta enviada");
            } catch (e) {
                res.status(500).end(e.stack)
                return;
            }

        }

        res.index = await getIndex(indexFile, isProduction ? prodSend : devSend, views);

        next()
    }

    middleWares.push(mvpMiddleWare)

    return middleWares;

}

async function getIndex(index, sender, views) {

    const html = await getTemplate(index)
    const SECTIONS_REGEXP = /{{([\w]+)}}/g
    // console.log(html);
    if (!html) return
    let obj = { _data: {}, _content: html, data: setData, send: sendFunction, _sender: sender };

    const sections = html.matchAll(SECTIONS_REGEXP)

    for (const section of sections) {

        const [value, key] = section;
        obj = { [key]: await sectionFunction(key, value, views), ...obj };

    }

    return obj

}


async function sectionFunction(key, value, views) {

    return function (section) {
        // console.log("colocar esta section en ", section, key, value);

        if (!views) { console.log("There are not templates registered"); return this }
        const view = views[section];
        if (!view) { console.log(section, "Is not valid template name"); return this }

        if (!fs.existsSync(view.path)) { console.log("Path does not exists:\n", view.path); return this }

        const content = getTemplate(view.path)
        this._content = this._content.replace(value, content)

        return this
    }
}
function setData(data) {
    this._data = data;
    return this
}
function sendFunction() {

    this._content = formatTemplate(this._content);
    const rendered = mvpSsr(this._data, this._content);

    this._sender(rendered);

}

function getTemplate(file) {

    return fs.readFileSync(file, { encoding: 'utf-8' })

}