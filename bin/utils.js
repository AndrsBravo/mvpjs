import fs from "fs";
import path from "path";
import ncp from "ncp";
import chalk from "chalk";
import * as cheerio from "cheerio";

import { promisify } from "util";
import templateBuilder from "./scripts/templateBuilder.js";
import constants from "./scripts/constants.js";
const copy = promisify(ncp);

export function setDefaults(options) {
  //console.log(`%s Creating ${options.target} process`, chalk.white.bgBlue.bold(" > "));

  getTemplateDirectory(options);

  if (!options.value) {
    console.error(`%s ${options.target} Name missed`, chalk.white.bgRed.bold(" ERROR "));
    process.exit(1);
  }
}

export function capitalizeCaseValue(options) {
  options.value = toCapitalizeCase(options.value);
}

export async function callingConfigParams(options) {
  options.mvpConfigContent = await mvpConfig(options);
  options.src = options.mvpConfigObject.src || "src";
}

export async function readingTemplateContent(options) {
  try {
    options.templateContent = fs.readFileSync(options.templateDirectory, { encoding: 'utf-8' });
    options.templateContent = options.templateContent.replaceAll(options.templateName, options.value);
  } catch (ex) { }
}
export async function readingHtmlFileContent(options) {

  if (!constants.FILES.json) {
    throw "Json file was not found";
  }

  const jsonPath = path.resolve(options.cwd, constants.FILES.json);

  const mvp = fs.readFileSync(jsonPath, "utf-8");
  const json = JSON.parse(mvp);

  //console.log(mvp);
  //console.log(json);

  if (!json.html) {
    throw "The HTMLFile was not found";
  }
  const htmlFileContent = fs.readFileSync(json.html, "utf-8");

  const $ = cheerio.load(htmlFileContent);
  const htmlElement = $(`#${options.html}`)[0];

  if (!htmlElement) {
    throw `The HTMLTemplate ${options.html} was not found`;
  }

  const html = templateBuilder(htmlElement);

  options.templateContent = options.templateContent.replace('html("")', html.template);
  options.templateContent = options.templateContent.replace('tags', [...html.tags].join(","));
}

export function setUpFilePath(options) {
  options.filePath = path.resolve(options.cwd, options.src, options.filePathName);

}

export async function fileTesting(options) {

  options.file = path.resolve(options.filePath, `${options.value}.js`);
  const fileExists = fs.existsSync(options.file);

  //const exists = await fileTesting(options);

  if (fileExists) {

    //console.log(`%s The file ${options.value} for ${options.target} already exists`, chalk.white.bgYellow.bold(" FILE EXISTS "));
    //console.log(`%s you have to remove it first`, chalk.bgYellow.white.bold(" FILE EXISTS "));
    throw new Error(`%s The file ${options.value} for ${options.target} already exists`, chalk.bgRed.bold(" FILE EXISTS "));

  }

  options.fileExists = !fileExists;

}

export async function createDirAndFileTemplate(options) {
  try {
    fs.mkdirSync(options.filePath, { recursive: true });
  } catch (error) {
    throw `%s Could not create ${options.target} directory`;
  }

  try {
    fs.writeFileSync(options.file, options.templateContent);
  } catch (error) {
    throw `%s No se puede escribir el contenido ${options.target} ${options.value} content`;
  }
}

export function updateConfigResource(options) {

  options.mvpConfigContent.routes.push("./" + path.relative(options.cwd, options.file).split(path.sep).join(path.posix.sep));
}

export function updateConfigLayout(options) {

  const routePath = "./" + path.relative(options.cwd, options.file).split(path.sep).join(path.posix.sep)

  const layout = `layout: () => import("${routePath}")`;

  const layoutPlaceInConfigContent = options.mvpConfigContent.substring(options.mvpConfigContent.indexOf("layout"), options.mvpConfigContent.indexOf("}"));

  options.mvpConfigContent = options.mvpConfigContent.replace(layoutPlaceInConfigContent, layout);
}

export function updateConfigRoute(options) {

  const routePath = "./" + path.relative(options.cwd, options.file).split(path.sep).join(path.posix.sep)

  let routeToReplaceInConfigContent = "routes: {";
  let route = `routes: { ${options.name}: () => import("${routePath}"),`;

  const routeName = `'${options.name}'`;


  let indexOfRouteAtConfigContent = options.mvpConfigContent.indexOf(routeName);

  if (indexOfRouteAtConfigContent > -1) {

    route = `${options.name}: () => import("${routePath}")`;

    let indexOfEndRouteAtConfigContent = options.mvpConfigContent.substring(indexOfRouteAtConfigContent).indexOf(",");

    routeToReplaceInConfigContent = options.mvpConfigContent.substring(indexOfRouteAtConfigContent, indexOfRouteAtConfigContent + indexOfEndRouteAtConfigContent)

  }

  options.mvpConfigContent = options.mvpConfigContent.replace(routeToReplaceInConfigContent, route);

}

export function writeMvpConfig(options) {
  const configUrl = path.resolve(options.cwd, "mvp.config.js");
  options.config = true;
  fs.writeFileSync(configUrl, options.mvpConfigContent, (error) => {
    if (error) { console.error(`%s Could not ReWrite Config content`, chalk.red.bold(" ERROR ")); return; }
    //console.log(`%s Config File ReWrited`, chalk.green.bold(" DONE "));
  });
}

export function getTemplateDirectory(options) {
  // const filepath = new URL(import.meta.url).pathname.substring(1);
  //options.templateDirectory = path.join(filepath, "../templates/init");
  options.templateDirectory = options.path + "/templates/init";

  return options;
}

export function toCapitalizeCase(text) {

  return (text.trim().charAt(0).toUpperCase() + text.trim().substr(1).toLowerCase());
}

export async function copyTemplateFiles({ templateDirectory, copyTo }) {
  return await copy(templateDirectory, copyTo, { clobber: false, });
}

export function setUpFilePathToBelong(options) {
  if (!options.belong) return;

  options.filePath = path.resolve(options.cwd, options.src, options.belong.toLowerCase(), options.filePathName);
}

export function setEndPointCollectionToaModel(options) {
  if (!options.belong) return;

  options.templateContent =
    `import ${options.belong}  from "../${options.belong}.js"; ` + options.templateContent.replaceAll("EndPointCollectionName", options.belong);
}

async function mvpConfig(options) {

  const configUrl = path.resolve(options.cwd, "mvp.config.js");
  let config = await import("file:///" + configUrl);

  options.mvpConfigObject = config.default.config;

  const result = fs.readFileSync(configUrl, "utf8");
  return result;

}
