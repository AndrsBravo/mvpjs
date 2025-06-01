import fs from "fs";
import { resolve } from "path";
import constants from "./constants.js";
export default function (options) {

    const { FILES } = constants;

    const node_module = resolve(options.cwd, FILES.NODE_MODULES);
    const mvp = resolve(options.cwd, FILES.MVP_FILE_PATH);
    const json = resolve(options.cwd, FILES.json);

    if (!fs.existsSync(node_module)) fs.mkdirSync(node_module);
    if (!fs.existsSync(mvp)) fs.mkdirSync(mvp);
    if (!fs.existsSync(json)) fs.writeFileSync(json, "{}");

    const fileContent = fs.readFileSync(json, "utf8");

    if (!fileContent) return;

    const object = JSON.parse(fileContent);

    const html = resolve(options.cwd, options.html);

    if (!fs.existsSync(html)) throw (options.html + " Does not exists");

    object.html = html;

    fs.writeFileSync(json, JSON.stringify(object), (error) => {
        if (error) { console.log(error); return; }
        console.log(`%s Config File ReWrited`, chalk.green.bold(" DONE "));
    });


}

