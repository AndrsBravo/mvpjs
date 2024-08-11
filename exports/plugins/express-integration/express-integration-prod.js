import serverConfig from 'server/config.js'
import getIndex from './getIndex.js'
import { join } from "node:path"

export default async () => {

    const { views } = serverConfig;

    const mvpMiddleWare = async (req, res, next) => {

        async function prodSend(template) {

            try {

                //  const rendered = await render(url, ssrManifest)            
                res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
                //console.log("Respuesta enviada");
            } catch (e) {
                res.status(500).end(e.stack)
                return;
            }

        }

        for (const key in serverConfig.inputs) {
            if (Object.hasOwnProperty.call(res, key)) continue;
            const index = serverConfig.inputs[key];
            res[index.key] = await getIndex(join(process.cwd(), "dist", index.file), prodSend, views);
        }

        next()
    }


    return mvpMiddleWare;

}
