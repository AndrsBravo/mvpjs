import fs from "fs";
import chalk from "chalk";
import { dirname, join } from "path";
import express from "express"
export async function scanDir(dir) {

    //  //console.log("Este es el dir a buscar", dir);

    const modules = [];

    function findModules(path) {

        //    //console.log("Scanning path", path);
        const list = fs.readdirSync(path, { withFileTypes: true });

        for (let item of list) {

            if (/\.js$/.test(item.name)) modules.push({ name: item.name, path: path + item.name });
            if (item.isDirectory()) findModules(join(path, item.name, "/"));

        };

    }

    findModules(dir);

    return modules;

}

export function scanViewsDir(dir) {

    //   //console.log("Este es el dir a buscar", dir);

    const views = {};
    const viewsArray = [];

    function findModules(path) {

        const list = fs.readdirSync(path, { withFileTypes: true });

        for (let item of list) {

            if (/\.html$/.test(item.name)) {

                const date = new Date();
                const dateColored = chalk.gray(`${date.toLocaleTimeString()}`)
                let head = `${dateColored} ${chalk.blue("[mvpjs]")}`;
                let [name] = item.name.split(".");
                let newName = name;
                const filePath = join(path, item.name);

                if (views[name]) {

                    const foldername = dirname(filePath).split("\/").pop();
                    console.warn(head, "The name", `\`${name}\``, "already exists");
                    newName = duplicatedName(name, foldername)
                    console.warn(head, "Key access for the file:", chalk.gray(filePath.replace(process.cwd(), "")))
                    console.warn(head, "would be rename to", `\`${newName}\``)

                }

                views[name] = { file: item.name, name, path: filePath };
                viewsArray.push(`${newName}:{ file: "${item.name}", name:"${name}", path:"${filePath}" }`)
            }
            if (item.isDirectory()) findModules(join(path, item.name, "/"));

        }


    }

    function duplicatedName(name, foldername) {

        let newName = name
        let i = 0;

        while (Object.hasOwnProperty.call(views, newName)) {
            newName = foldername + "_" + name
        }
        return newName

    }


    findModules(dir);

    return viewsArray;

}

export function getServerViews({ viewsPath, viewsFile, viewsFilePath }) {

    if (!viewsFile) return
    if (!fs.existsSync(viewsFilePath)) return;
    const views = scanViewsDir(viewsPath);
    fs.writeFileSync(join(viewsFilePath, viewsFile), `export default { ${views.join(",")}  };`)


}

export async function getServerMiddleWare(modules) {

    let router;

    if (express) router = express.Router();

    let use = [];

    for (let module of modules) {

        let file = module.path;
        if (!fs.existsSync(file)) continue;

        const content = fs.readFileSync(file);

        const TEST_USE_REGEXP = /@use/i;
        const TEST_ROUTE_REGEXP = /@route[\s]*[\r]*\([\s]*(['"\/\w:]*)\)/i;

        let add = TEST_USE_REGEXP.test(content) ? devOrProdTest(content) : false

        if (add) {

            const u = await import(file);

            for (let us in u) {

                use.push(u[us])

            }

        }

        add = TEST_ROUTE_REGEXP.test(content) ? devOrProdTest(content) : false

        if (add) {
            //  //console.log("-----Agregando el route", file);

            const routeHandler = await import(file);
            if (!routeHandler) continue;

            const path = TEST_ROUTE_REGEXP.exec(content)[1]

            if (routeHandler.default) {
                router.use(path, routeHandler.default)
            }

            for (let method in routeHandler) {

                let methodLower = method.toLowerCase();

                if (router[methodLower]) router[methodLower](path, routeHandler[method])

            }

        }
    }
    return [...use, router];

}

export async function getClientRoutesObject({ clientRoutePath, clientRouteFilePath, clientPath }) {

    const modules = await scanDir(clientPath)

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


            const a = path.split('/')

            let el = routes;
            let property = "";

            for (const iterator of a) {

                if (iterator == '') continue;

                if (!el[`'${iterator}'`]) el[`'${iterator}'`] = {}

                el = el[`'${iterator}'`]
                property = iterator;

            }

            el['layout'] = importText

        }

        if (TEST_PAGE_REGEXP.test(content)) {

            const path = TEST_PAGE_REGEXP.exec(content)[1]

            if (!path || path == '/') {

                if (!routes[`'/'`]) routes[`'/'`] = {}
                routes[`'/'`]['page'] = importText;
                continue
            }


            const a = path.split('/')

            let element = routes;
            let property = "";

            if (a.length == 1) {

                let iterator = a[0];

                if (iterator == '') continue;

                //   //console.log("Page route", iterator);

                if (!element[`'${iterator}'`]) element[`'${iterator}'`] = {}
                element = element[`'${iterator}'`]

                //   //console.log("Page route", el);
                //  //console.log(importText);

                element['page'] = importText

                //    //console.log("Page route", el);
                continue

            }

            //   //console.log(routes);
            let otro = routes;
            property = "";

            for (const iterator of a) {

                if (iterator == '') continue;
                if (property == '') { property = iterator; continue }

                if (!otro[`'${property}'`]) otro[`'${property}'`] = {}

                otro = otro[`'${property}'`]
                property = iterator;

            }

            otro[`'${property}'`] = importText
            //     //console.log("El otro", routes);

        }
    }

    if (!fs.existsSync(clientRoutePath)) {
        fs.mkdirSync(clientRoutePath)
    }

    const mvpConfigFilePath = join(clientRoutePath, "mvp.config.js")
    // const data = routesFileContent.replace("content", routes.join(","))
    //  //console.log("Antes de escribir", routes);
    let data = JSON.stringify(routes).replaceAll("\"", "");
    data = routesFileContent.replace("{content}", data)
    fs.writeFileSync(clientRouteFilePath, data, { encoding: "utf-8" })
    const mvpConfigFileRoute = join(process.cwd(), "mvp.config.js");
    let mvpConfigContent = "export default {};"
    if (fs.existsSync(mvpConfigFileRoute)) {

        mvpConfigContent = fs.readFileSync(mvpConfigFileRoute, { encoding: "utf-8" })

    }

    fs.writeFileSync(mvpConfigFilePath, mvpConfigContent, { encoding: "utf-8" })

}

function devOrProdTest(content) {

    const TEST_DEVELOPMENT_REGEXP = /@development/i;
    const TEST_PRODUCTION_REGEXP = /@production/i;

    return ((TEST_PRODUCTION_REGEXP.test(content) ? process.env.NODE_ENV?.toLocaleLowerCase() == "production" : true) &&
        (TEST_DEVELOPMENT_REGEXP.test(content) ? process.env.NODE_ENV?.toLocaleLowerCase() == "development" : true))

}