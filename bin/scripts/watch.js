import fs from "fs"
import { resolve } from "path"
export default function (options) {

    const dir = resolve(options.cwd, "src");
    //console.log("Go to watch this dir:", dir);
    fs.watch(dir, (eventType, fileModified) => {

        //console.log("EventType:", eventType);
        //console.log("FileModified:", fileModified);

    })


}