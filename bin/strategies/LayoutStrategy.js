import Listr from "listr";
import { setDefaults } from "../utils.js";
import { callingConfigParams } from "../utils.js";
import { readingTemplateContent } from "../utils.js";
import { setUpFilePath } from "../utils.js";
import { fileTesting } from "../utils.js";
import { createDirAndFileTemplate } from "../utils.js";
import { updateConfigLayout } from "../utils.js";
import { writeMvpConfig } from "../utils.js";

export default async function creatingLayout(options) {
  options.value = options.layout;
  options.target = "Layout";
  options.templateDirName = "layout/Layout.js";
  options.templateName = "LayoutName";
  options.filePathName = options.target.toLowerCase();

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
      title: "Reading template content: ",
      task: () => readingTemplateContent(options),
    },
    {
      title: "Setting Up File Path: ",
      task: () => setUpFilePath(options),
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
      title: "Update layout at config",
      task: () => updateConfigLayout(options),
      enabled: () => options.fileExists,
    },
    {
      title: "ReWritting config file resource",
      task: () => writeMvpConfig(options),
      enabled: () => options.fileExists,
    },
  ]);

  await task.run();
}

export function setLayoutToConfigFile(options) {
  options.config.layout = options.value;
}
