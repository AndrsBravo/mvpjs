import express from 'express'
import dotenv from "dotenv"
dotenv.config()

import expressAutoLoad from "../integration/express-autoload/express-autoload.js"

const app = express()

async function run(port) {

    app.use(express.json());
    app.use(await expressAutoLoad());

    // Start http server
    app.listen(port, () => {
        //console.log(`Server started at http://localhost:${port}`)
    })

}

export default { app, run }