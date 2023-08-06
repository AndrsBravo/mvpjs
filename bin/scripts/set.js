import fs from "fs";
import { resolve } from "path";
import constants from "./constants.js";
export default function (options) {

    const { files } = constants;

    const node_module = resolve(options.cwd, files.node);
    const mvp = resolve(options.cwd, files.mvp);
    const json = resolve(options.cwd, files.json);

    if (!fs.existsSync(node_module)) fs.mkdirSync(node_module);
    if (!fs.existsSync(mvp)) fs.mkdirSync(mvp);
    if (!fs.existsSync(json)) fs.writeFileSync(json, "{}");

    const fileContent = fs.readFileSync(json, "utf8");

    if (!fileContent) return;

    const object = JSON.parse(fileContent);

    const html = resolve(options.cwd, options.html);

    if (!fs.existsSync(html)) throw (options.html + " Does not exists");

    object.html = html;

    fs.writeFileSync(json, JSON.stringify(object), (err) => {
        if (error) { console.log(error); return; }
        console.log(`%s Config File ReWrited`, chalk.green.bold(" DONE "));
    });


}

