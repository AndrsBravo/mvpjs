 import * as fs from "fs";
import path from "path";

function getFiles(src) {
    const files = fs.readdirSync(src);
    let result = [];

    files.forEach((resouce) => {
        if (resouce.endsWith(".html")) return;
        if (resouce.endsWith(".css")) return;
        if (resouce.endsWith(".js")) {
            result.push(`${src}/${resouce}`);
            return;
        }

        result = [...result, ...getFiles(`${src}/${resouce}`)];
    });
    return result;
}

export default function (options) {

    options.recap = options.recap.toLowerCase();

    options.dir = path.resolve(options.dir).replaceAll("\\", "/");

    const dirs = getFiles(options.dir);
    const action = strategy()[options.recap];
    if (!action) return;

    action(dirs);

}


function strategy() {

    return {
        mvp: (data) => {

            const result = data.map(resource => {

                const name = resource.substring(resource.lastIndexOf("/") + 1, resource.indexOf(".js"));

                if (name.indexOf(".") > -1) return "";
                if (name.indexOf("mvp") > -1) return "";
                if (name.indexOf("App") > -1) return "";
                if (name.indexOf("MvpImport") > -1) return "";

                return `get ${name}() {return import('${resource}');}`

            });
            writeFile(path.resolve("./MvpImport.js"), result, "MvpImport");

        },
        application: (data) => {

            const result = data.map(resource => {

                const name = resource.substring(resource.lastIndexOf("/") + 1, resource.indexOf(".js"));

                if (name.indexOf(".") > -1) return "";
                if (name.indexOf("mvp") > -1) return "";
                if (name.indexOf("App") > -1) return "";
                if (name.indexOf("MvpImport") > -1) return "";

                return `get ${name}() {return import('${resource}');}`

            });
            writeFile("./build/lib/AppImport.js", result, "AppImport");

        },
    }

}
//C:\Users\Bravo\Documents\B.IT\CreActivo\Formacion\Formacion-JS\node\mvp\build\lib\AppImport.js
function writeFile(filePath, data, className) {

    fs.writeFileSync(path.resolve(path.dirname(process.argv[1]), "..", filePath), `class ${className} { constructor() { } 
    ${data.join(" ")} } export { ${className}  as default };`)

}