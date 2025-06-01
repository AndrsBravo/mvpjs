import constants from "bin/scripts/constants";

const { OUT_DIR } = constants.FILES;

function excluded(name) {

    if (/^\./.test(name)) return true;
    if (/public/.test(name)) return true;
    if (/css/.test(name)) return true;
    if (/\.json/.test(name)) return true;
    if (OUT_DIR == name) return true;
    if (/node_modules/.test(name)) return true;
    if (/mvp\.config\.js/.test(name)) return true;

}

export async function scanDir(dir, RegExp, callBack) {
    if (!fs.existsSync(dir)) {
        // return console.log("No existe la ruta solicitada \n", dir);
    }
    console.log("-------Este es el dir a buscar -----", dir);

    function findModules(path) {

        //    //console.log("Scanning path", path);
        const list = fs.readdirSync(path, { withFileTypes: true });

        for (let item of list) {
            if (excluded(item.name)) continue;
            if (item.isDirectory()) { findModules(join(path, item.name, "/")); continue; }
            if (RegExp && RegExp.test(item.name) == false) continue;
            if (callBack) callBack(item)
        };

    }

    findModules(dir);

}