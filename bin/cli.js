#!/usr/bin/env node

import parser from "./parser.js";
import callActions from "./CliActions.js";
const args = await parser(process.argv);
callActions(args);

/*
import fs from "fs";
import cheerio from "cheerio";
import path from "path";
import templateBuilder from "./scripts/templateBuilder.js";

const htmlFileRute = path.resolve(process.cwd(), "dist/index.html");
const htmlFileContent = fs.readFileSync(htmlFileRute, "utf-8");

const $ = cheerio.load(htmlFileContent);
const algo = templateBuilder($(`[data-systemtemplate=plantilla]`)[0]);

console.log("------la plantilla");
console.log(algo);
*/
