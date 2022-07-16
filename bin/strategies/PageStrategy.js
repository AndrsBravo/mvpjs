import Listr from "listr";
import { setDefaults } from "../utils.js";
import { callingConfigParams } from "../utils.js";
import { readingTemplateContent } from "../utils.js";
import { setUpFilePath } from "../utils.js";
import { setUpFilePathToBelong } from "../utils.js";
import { fileTesting } from "../utils.js";
import { createDirAndFileTemplate } from "../utils.js";
import { updateConfigRoute } from "../utils.js";
import { writeMvpConfig } from "../utils.js";

export default async function creatingPage(options) {
  options.value = options.page;
  options.target = "Page";
  options.templateDirName = "page/Page.js";
  options.templateName = "PageName";
  options.filePathName = "pages";
  options.name = !options.name ? `'${options.page.toLowerCase()}'` : `'${options.name.toLowerCase()}'`;

  const task = new Listr([
    {
      title: "Set defaults of " + options.value,
      task: () => setDefaults(options),
    },
    {
      title: "Calling config: ",
      task: () => callingConfigParams(options),
    },
    {
      title: "Reading template contentent: ",
      task: () => readingTemplateContent(options),
    },
    {
      title: "Setting Up File Path: ",
      task: () => setUpFilePath(options),
    },
    {
      title: "Setting Up File Path if belong to: ",
      task: () => setUpFilePathToBelong(options),
    },
    {
      title: "Testing File",
      task: () => fileTesting(options),
    },
    {
      title: "Creating files",
      task: () => createDirAndFileTemplate(options),
      enabled: () => options.fileExists,
    },
    {
      title: "Update config route",
      task: () => updateConfigRoute(options),
      enabled: () => options.fileExists,
    },
    {
      title: "ReWritting config file resource",
      task: () => writeMvpConfig(options),
      enabled: () => options.fileExists,
    },
  ], { exitOnError: true });

  await task.run();

  // console.log(`%s ${options.target} ${options.value} created`, chalk.green.bold("DONE"));
}