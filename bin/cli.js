#!/usr/bin/env node
//import parser from "parser";

import ncp from "ncp";
import arg from "arg";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";
import Listr from "listr";

let result = parseArgumentsIntoOptions(process.argv);
console.log(result);
const access = promisify(fs.access);
const copy = promisify(ncp);

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--start": Boolean,
      "--layout": Boolean,
      "--entity": Boolean,
      "--form": Boolean,
      "--view": Boolean,
      "--template": Boolean,
      "-s": "--start",
      "-l": "--layout",
      "-e": "--entity",
      "-f": "--form",
      "-v": "--view",
      "-t": "--template",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    start: args["--start"] || false,
    layout: args["--layout"] || false,
    entity: args["--entity"] || false,
    form: args["--form"] || false,
    view: args["--view"] || false,
    template: args["--template"] || false,
    name: args._[0],
    url: args._[1],
  };
}

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.url || process.cwd(),
  };

  const filepath = new URL(import.meta.url).pathname.substring(1);

  const templateDir = path.resolve(
    filepath,
    "../../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    console.log(templateDir);
    await access(templateDir, fs.constants.R_OK);
  } catch (error) {
    console.error("%s Invalid template name ", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const task = new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Initialize git",
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? "Pass --install to automatically install dependencies"
          : undefined,
    },
  ]);

  await task.run();

  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}
