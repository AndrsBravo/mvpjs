import fs from "fs";
import path from "path";
import ncp from "ncp";
import chalk from "chalk";
import { promisify } from "util";
const copy = promisify(ncp);

export function setDefaults(options) {
  console.log(
    `%s Creating ${options.target} propcess here!`,
    chalk.blue.bold(">")
  );

  getTemplateDirectory(options);

  if (!options.value) {
    console.error(`%s ${options.target} Name missed`, chalk.red.bold("ERROR"));
    process.exit(1);
  }
}

export function capitalizeCaseValue(options) {
  options.value = toCapitalizeCase(options.value);
}

export async function callingConfigParams(options) {
  options.config = await mvpConfig(options);
  options.src = options.config.src || "src";
}

export async function readingTemplateContent(options) {
  try {
    options.templateContent = fs.readFileSync(
      options.templateDirectory,
      "utf8"
    );
    options.templateContent = options.templateContent.replaceAll(
      options.templateName,
      options.value
    );
  } catch (ex) {}
}

export function setUpFilePath(options) {
  options.filePath = path.resolve(
    options.cwd,
    options.src,
    options.filePathName
  );
}

export function fileTesting(options) {
  options.file = path.resolve(options.filePath, `${options.value}.js`);
  const fileExists = fs.existsSync(options.file);

  if (fileExists) {
    console.log(`-----The ${options.target} Exists`);
    return false;
  }
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
    throw `%s Could not write ${options.target} ${options.value} content`;
  }

  console.log(
    `%s ${options.target} ${options.value} created`,
    chalk.green.bold("DONE")
  );
}

export function updateConfigResource(options) {
  options.config.resources[options.value.toLowerCase()] =
    options.file.replaceAll(options.cwd, "");
}

export function writeMvpConfig(options) {
  const configUrl = path.resolve(options.cwd, "mvp.config.js");
  const configContent = `export default ${JSON.stringify(options.config)}`;

  fs.writeFileSync(configUrl, configContent, (error) => {
    if (error) {
      console.error(
        `%s Could not ReWrite Config content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(`%s Config File ReWrited`, chalk.green.bold("DONE"));
  });
}

export function getTemplateDirectory(options) {
  const filepath = new URL(import.meta.url).pathname.substring(1);

  options.templateDirectory = path.resolve(
    filepath,
    "../../lib/templates",
    options.templateDirName
  );

  return options;
}

export function toCapitalizeCase(text) {
  return (
    text.trim().charAt(0).toUpperCase() + text.trim().substr(1).toLowerCase()
  );
}

export async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.cwd, {
    clobber: false,
  });
}

export function setUpFilePathToBelong(options) {
  if (options.belong && options.config.resources[options.belong]) {
    let belong = options.config.resources[options.belong];

    belong = options.cwd + path.dirname(belong);
    options.filePath = path.resolve(belong, options.filePathName);
  }
}

async function mvpConfig(options) {
  const configUrl = path.resolve(options.cwd, "mvp.config.js");
  let config = await import("file:///" + configUrl);
  return config.default;
}
