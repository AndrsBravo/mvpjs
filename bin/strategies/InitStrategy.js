import fs from "fs";
import chalk from "chalk";
import Listr from "listr";
import { promisify } from "util";
import { copyTemplateFiles } from "../utils.js";
import { setDefaults } from "../utils.js";
import { getTemplateDirectory } from "../utils.js";

const access = promisify(fs.access);

export default async function initProject(options) {
  options.templateDirName = "start";

  console.log("Initializing project");
  const task = new Listr([
    {
      title: "Setting Up directory path",
      task: () => getTemplateDirectory(options),
    },
    {
      title: "Creating Up and copy start files",
      task: () => setUp(options),
    },
  ]);

  await task.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}

async function setUp(options) {
  try {
    console.log(options.path);
    console.log("SetUp", options.templateDirectory);
    await access(options.templateDirectory, fs.constants.R_OK);
    copyTemplateFiles(options);
  } catch (error) {
    console.error("%s Invalid template location ", chalk.red.bold("ERROR"));
    process.exit(1);
  }
}
