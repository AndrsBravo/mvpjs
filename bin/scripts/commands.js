import { exec } from "node:child_process"
import { resolve, dirname } from "path"

export default function (options) {

    //console.log("Ejecutando");
    //console.log(process.cwd());
    //console.log(import.meta.resolve("./"));
    //console.log(options.cwd);

    if (options.dev) {

        //console.log("Ejecutando el modo dev");
        exec(options.cwd + "/node_modules/mvp-fullstack/ | npm run devStart", (err, stdout, stderr) => {

            if (err) {
                //console.log("Ha occurrido un error");
                console.error(err);
            }

            if (stdout) {
                //console.log("StdOut:", stdout);
            }

            if (stderr) {

                //console.log("stderr", stderr);
            }

        })
    }

}