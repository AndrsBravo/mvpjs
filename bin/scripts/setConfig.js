import path from "path";
import fs from "fs";
export default function (options) {

    let mvpConfigFileContent = fs.readFileSync(path.resolve("mvp.config.js"), "utf8");

    mvpConfigFileContent

    let newMvpConfigFileContent = mvpConfigFileContent;
    let result = [];
    let match = /"([^"]+)"/.exec(newMvpConfigFileContent);

    while (match != null) {

        result.push(match[1]);
        newMvpConfigFileContent = newMvpConfigFileContent.substring(match.index + match[0].length);

        match = /"([^"]+)"/.exec(newMvpConfigFileContent);
    }

    if (result.length < 1) return;

    while (result.length > 0) {

        const href = result.shift();
        const absolutePath = path.resolve(href).replaceAll("\\", "/");
        mvpConfigFileContent = mvpConfigFileContent.replaceAll(href, absolutePath);

    }

    fs.writeFileSync(path.resolve(path.dirname(process.argv[1]), "..", "build/lib/App.config.js"), mvpConfigFileContent)

}