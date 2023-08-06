import Listr from "listr";
import { setDefaults } from "../utils.js";
import { callingConfigParams } from "../utils.js";
import { readingTemplateContent } from "../utils.js";
import { readingHtmlFileContent } from "../utils.js";
import { setUpFilePath } from "../utils.js";
import { setUpFilePathToBelong } from "../utils.js";
import { fileTesting } from "../utils.js";
import { createDirAndFileTemplate } from "../utils.js";

export default async function creatingTemplate(options) {
  options.value = options.template;
  options.target = "Template";
  options.templateDirName = "view/html/Template.js";
  options.templateName = "TemplateName";
  options.filePathName = "views/templates";

  const task = new Listr([
    {
      title: "Set defaults of " + options.value,
      task: async () => setDefaults(options),
    },
    {
      title: "Calling config: ",
      task: async () => callingConfigParams(options),
    },
    {
      title: "Reading template contentent: ",
      task: async () => readingTemplateContent(options),
    },
    {
      title: "Getting HTMLTemplate from html file: ",
      task: async () => readingHtmlFileContent(options),
      enabled: () => options.html,
    },
    {
      title: "Setting Up File Path: ",
      task: async () => setUpFilePath(options),
    },
    {
      title: "Setting Up File Path if belong to: "+options.belong,
      task: async () => setUpFilePathToBelong(options),
    },
    {
      title: "Testing File",
      task: async () => fileTesting(options),
    },
    {
      title: "Creating files",
      task: async () => createDirAndFileTemplate(options),
      enabled: () => options.fileExists,
    },
  ]);

  await task.run();
}