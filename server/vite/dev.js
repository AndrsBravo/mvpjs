import { createServer } from "vite"
import { dirname, join } from "node:path"
import { fileURLToPath } from 'node:url'

console.log("Llamando el basic");

const rootDir = dirname(fileURLToPath(import.meta.url));
const configFile = join(rootDir, "./vite.config.js")
console.log({ rootDir });

console.log({ configFile });

try {

    const server = await createServer({ configFile })
    await server.listen()
    //server.printUrls();
    server.bindCLIShortcuts({ print: true });


} catch (error) {
    console.error(error);

}


//export default vite