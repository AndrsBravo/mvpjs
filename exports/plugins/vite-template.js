import formatTemplate from "lib/mvp/view/render/formatTemplate.js"

function viteHtmlTemplate() {
    return {
        name: "vite:mvp-html-template",
        enforce: "pre",
        async resolveId(id, importer, options) {
            //  //console.log("----resolveId---", id);
            if (/\.html$/.test(id) && importer && !options.scan) {
                let res = await this.resolve(id, importer, {
                    skipSelf: true,
                    ...options,
                });
                //    //console.log("El id resolved-------", id);
                //  if (!res || res.external) { //console.log(res); return res };

                return res.id + "?raw";
            }

        },

        transform(src, id) {

            //      //console.log("transform-----", id);
            //      //console.log(process.cwd());

            if (/\.html$/.test(id) || /\.html\?raw$/.test(id)) {
                // //console.log("transform", id);
                //  //console.log(formatTemplate(src));
                return { code: formatTemplate(src), map: { mappings: "" } }
            }

        }

    }

}

export { viteHtmlTemplate };
