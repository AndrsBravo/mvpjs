
/**
 * 
 * @param {Object} param
 * @property {string} param.clientPath - 
 */
export async function setClientConfig({ clientPath, clientConfigPath, clientConfiFilePath }) {

    if (!fs.existsSync(clientPath)) {
        console.log("No existe la ruta cliente \n", clientPath);
        clientPath = process.cwd();
    }

    const modules = await scanDir(clientPath)

    //  console.log("Modulos", modules);

    const routesFileContent = 'export default {content}'
    const routes = {}

    // //console.log(modules);

    for (let module of modules) {

        let file = module.path;
        if (!fs.existsSync(file)) continue;

        const content = fs.readFileSync(file);

        //   //console.log(await import(file));

        // const TEST_LAYOUT_REGEXP = /@layout/i;
        // const TEST_LAYOUT_REGEXP = /@layout[\s]*[\r]*\([\s]*['|"]{0,1}[\/]{0,1}([\w]*)['|"]{0,1}[\s]*[\r]*\)/i;
        // const TEST_PAGE_REGEXP = /@page[\s]*[\r]*\([\s]*['|"]{0,1}[\/]{0,1}([\w]*)['|"]{0,1}[\s]*[\r]*\)/i;
        const TEST_LAYOUT_REGEXP = /@layout[\s]*[\r]*\([\s]*['|"]{0,1}[\/]{0,1}([\w\/]*)['|"]{0,1}[\s]*[\r]*\)/i;
        const TEST_PAGE_REGEXP = /@page[\s]*[\r]*\([\s]*['|"]{0,1}[\/]{0,1}([\w\/]*)['|"]{0,1}[\s]*[\r]*\)/i;

        const importText = `async()=> await import('${file}')`

        if (TEST_LAYOUT_REGEXP.test(content)) {

            const path = TEST_LAYOUT_REGEXP.exec(content)[1]

            if (!path || path == '/') {

                if (!routes[`'/'`]) routes[`'/'`] = {}
                routes[`'/'`]['layout'] = importText;
                //console.log({ routes });
                continue
            }

            const pathArray = path.split('/');

            let route = routes;
            let property = "";

            for (const pathPart of pathArray) {

                if (pathPart == '') continue;
                if (!route[`'${pathPart}'`]) route[`'${pathPart}'`] = {}

                route = route[`'${pathPart}'`]
                property = pathPart;

            }

            route['layout'] = importText

        }

        if (TEST_PAGE_REGEXP.test(content)) {

            const path = TEST_PAGE_REGEXP.exec(content)[1]

            if (!path || path == '/') {

                if (!routes[`'/'`]) routes[`'/'`] = {}
                routes[`'/'`]['page'] = importText;
                continue
            }

            const pathArray = path.split('/')

            let element = routes;

            for (const iterator of pathArray) {

                if (iterator == '') continue;

                //   //console.log("Page route", iterator);

                if (!element[`'${iterator}'`]) element[`'${iterator}'`] = {}
                element = element[`'${iterator}'`]

                element['page'] = importText

            }

            /*
                        //   //console.log(routes);
                        let otro = routes;
                        property = "";
            
                        for (const iterator of pathArray) {
            
                            if (iterator == '') continue;
                            if (property == '') { property = iterator; continue }
            
                            if (!otro[`'${property}'`]) otro[`'${property}'`] = {}
            
                            otro = otro[`'${property}'`]
                            property = iterator;
            
                        }
            
                        otro[`'${property}'`] = importText
                        //     //console.log("El otro", routes);
            */
        }
    }

    if (!fs.existsSync(clientConfigPath)) {
        fs.mkdirSync(clientConfigPath)
    }
    let data = JSON.stringify(routes).replaceAll("\"", "");
    data = routesFileContent.replace("{content}", data)
    fs.writeFileSync(clientConfiFilePath, data, { encoding: "utf-8" })

    /* 
     const mvpConfigFileRoute = join(process.cwd(), "mvp.config.js");
     let mvpConfigContent = "export default {};"
     
     const mvpConfigFilePath = join(clientConfigPath, "mvp.config.js")
     if (fs.existsSync(mvpConfigFileRoute)) {
         mvpConfigContent = fs.readFileSync(mvpConfigFileRoute, { encoding: "utf-8" })
    }
     fs.writeFileSync(mvpConfigFilePath, mvpConfigContent, { encoding: "utf-8" })
 */
}
