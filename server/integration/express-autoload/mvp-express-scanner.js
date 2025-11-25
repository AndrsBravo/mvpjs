import fs from "fs";
import chalk from "chalk";
import { dirname, join } from "path";
import express from "express"


export function scanViewsDir(dir) {

    if (!dir || !fs.existsSync(dir)) {
        return console.log("No existe la ruta solicitada \n", dir);

    }
    //   //console.log("Este es el dir a buscar", dir);

    const views = {};
    const viewsArray = [];

    function findModules(path) {

        const list = fs.readdirSync(path, { withFileTypes: true });

        for (let item of list) {

            if (/^\./.test(item.name)) continue;
            if (/dist/.test(item.name)) continue;
            if (/node_modules/.test(item.name)) continue;
            if (/\.html$/.test(item.name) == false) {

                console.log("Cargando las views----", item.name);

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
    if (!viewsPath) return
    if (!fs.existsSync(viewsFilePath)) return;
    const views = scanViewsDir(viewsPath);
    fs.writeFileSync(join(viewsFilePath, viewsFile), `export default { ${views.join(",")}  };`)

}

export async function getServerMiddleWare(modules) {

    let router;

    if (express) router = express.Router();

    let use = [];

    if (!modules) {
        console.log("No se han cargado modulos");
        return [...use, router];
    }
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
