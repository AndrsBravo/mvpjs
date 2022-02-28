#!/usr/bin/env node
//import parser from "parser";

import ncp from "ncp";
import arg from "arg";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";
import Listr from "listr";

const access = promisify(fs.access);
const copy = promisify(ncp);

let result = parseArgumentsIntoOptions(process.argv);
console.log(result);
callActions(result);

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--init": Boolean,
      "--layout": String,
      "--entity": String,
      "--model": String,
      "--presenter": String,
      "--form": String,
      "--view": String,
      "--template": String,
      "--only": Boolean,
      "-i": "--init",
      "-l": "--layout",
      "-e": "--entity",
      "-m": "--model",
      "-p": "--presenter",
      "-f": "--form",
      "-v": "--view",
      "-t": "--template",
      "-o": "--only",
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    init: args["--init"] || false,
    layout: args["--layout"],
    entity: args["--entity"],
    model: args["--model"],
    presenter: args["--presenter"],
    form: args["--form"],
    view: args["--view"],
    template: args["--template"],
    only: args["--only"] || false,
    name: args._[0],
    url: args._[1],
    cwd: process.cwd(),
  };
}

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.cwd, {
    clobber: false,
  });
}

function getTemplateDirectory(options, directory) {
  const filepath = new URL(import.meta.url).pathname.substring(1);

  options.templateDirectory = path.resolve(
    filepath,
    "../../lib/templates",
    directory
  );

  return options;
}

export async function initProject(options) {
  options = getTemplateDirectory(options, "start");

  try {
    console.log(options.templateDirectory);
    await access(options.templateDirectory, fs.constants.R_OK);
    copyTemplateFiles(options);
  } catch (error) {
    console.error("%s Invalid template name ", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}

async function callActions(options) {
  const task = new Listr([
    {
      title: "Initialize project",
      task: () => initProject(options),
      enabled: () => options.init,
    },
    {
      title: "Creating Layout " + options.layout,
      task: () => creatingLayout(options),
      enabled: () => options.layout,
    },
    {
      title: "Creating Entity " + options.entity,
      task: () => creatingEntity(options),
      enabled: () => options.entity,
    },
    {
      title: "Creating Model " + options.model,
      task: () => creatingModel(options),
      enabled: () => options.model,
    },
    {
      title: "Creating Form " + options.name,
      task: () => creatingForm(options),
      enabled: () => options.form,
    },
    {
      title: "Creating View " + options.name,
      task: () => creatingView(options),
      enabled: () => options.view,
    },
    {
      title: "Creating Template " + options.name,
      task: () => creatingTemplate(options),
      enabled: () => options.template,
    },
  ]);

  await task.run();
}

function initializingProject() {
  console.log(" > Initializing project propcess here!");
}

function creatingLayout() {
  console.log("%s Creating Layout propcess here!", chalk.blue.bold(">"));
}
function toCapitalizeCase(text) {
  return (
    text.trim().charAt(0).toUpperCase() + text.trim().substr(1).toLowerCase()
  );
}

function creatingEntity(options) {
  console.log("%s Creating Entity propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "entity/Entity.js");
  if (!options.entity) {
    console.error("%s Entity Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }
  const entity = toCapitalizeCase(options.entity);
  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll("EntityName", entity);
  } catch (ex) {}

  const filePath = path.resolve(
    options.cwd,
    "src",
    options.entity.toLowerCase()
  );

  const file = path.resolve(filePath, `${entity}.js`);
  const fileExists = fs.existsSync(file);

  if (fileExists) {
    console.log("-----The Entity Exists");
    return;
  }

  fs.mkdirSync(filePath, { recursive: true }, (error) => {
    if (error) {
      console.error(
        `%s Could not create ${options.entity} directory`,
        chalk.red.bold("ERROR")
      );
      return;
    }
  });
  fs.writeFile(file, templateContent, (error) => {
    if (error) {
      console.error(
        `%s Could not write Entity ${options.entity} content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(
      `%s Entity ${options.entity} created`,
      chalk.green.bold("DONE")
    );
  });
}

function creatingModel(options) {
  console.log("%s Creating Model propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "model/Model.js");
  if (!options.model) {
    console.error("%s Model Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }
  const entity = toCapitalizeCase(options.entity);
  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent
      .replaceAll("EntityName", entity)
      .replaceAll("ModelName", options.model);
  } catch (ex) {}

  const filePath = path.resolve(
    options.cwd,
    "src",
    options.entity.toLowerCase(),
    "models"
  );
  const file = path.resolve(filePath, `${options.model}.js`);
  fs.mkdirSync(filePath, { recursive: true }, (error) => {
    if (error) {
      console.error(
        `%s Could not create ${filePath} directory`,
        chalk.red.bold("ERROR")
      );
      return;
    }
  });
  fs.writeFile(file, templateContent, (error) => {
    if (error) {
      console.error(
        `%s Could not write Model ${options.model} content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(`%s Model ${options.model} created`, chalk.green.bold("DONE"));
  });
}

function creatingForm() {
  console.log(" > Creating Form propcess here!");
}

function creatingView() {
  console.log(" > Creating View propcess here!");
}

function creatingTemplate() {
  console.log(" > Creating Template propcess here!");
}
