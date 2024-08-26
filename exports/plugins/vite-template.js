import formatTemplate from "lib/mvp/view/render/formatTemplate.js"
/** @return {import('vite').Plugin} */
function viteHtmlTemplate() {
    return {
        name: "vite:mvp-html-template",
        enforce: "pre",
        resolveId: {
            async handler(id, importer, options) {
                //   console.log("----resolveId---", id);
                if (/\.html$/.test(id) && importer && !options.scan) {
                    let res = await this.resolve(id, importer, {
                        skipSelf: true,
                        ...options,
                    });

                    return res.id + "?raw";
                }
                return null

            }
        },

        transform(src, id) {

            //  console.log("transform-----", id);

            if (/\.html$/.test(id) || /\.html\?raw$/.test(id)) {
                return { code: formatTemplate(src), map: { mappings: "" } }
            }

        },
        resolveDynamicImport(resolver) {

            if (!resolver.right) return null

            const { value } = resolver.right

            if (value && value.startsWith("/node_modules/.mvpjs/"))
                return {

                    id: process.cwd() + value,
                    external: false
                }

            return null

        }

    }

}

export { viteHtmlTemplate };
