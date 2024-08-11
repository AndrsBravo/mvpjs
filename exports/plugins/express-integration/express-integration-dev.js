import serverConfig from 'server/config.js'
import getIndex from './getIndex.js';
import { join } from "node:path"
export default async ({ vite }) => {

    const { inputs, views } = serverConfig;

    const mvpMiddleWare = async (req, res, next) => {

        async function devSend(template) {

            try {
                const base = '/';
                const url = req.originalUrl.replace(base, '')

                let rendered = await vite.transformIndexHtml(url, template)

                // render = (await vite.ssrLoadModule('/src/entry-server.js')).render
                //  render = (await vite.ssrLoadModule('../../lib/mvp/view/render/formatTemplate.js')).render

                //  const rendered = await render(url, ssrManifest)


                res.status(200).set({ 'Content-Type': 'text/html' }).end(rendered)
                //console.log("Respuesta enviada");
            } catch (e) {
                vite?.ssrFixStacktrace(e)
                res.status(500).end(e.stack)
                return;
            }

        }

        for (const key in inputs) {
            if (Object.hasOwnProperty.call(res, key)) continue;

            const index = inputs[key];
            res[index.key] = await getIndex(join(process.cwd(), index.file), devSend, views);
        }

        next()
    }

    //console.log("Ya se devolvio el middleware");
    return mvpMiddleWare;

}
