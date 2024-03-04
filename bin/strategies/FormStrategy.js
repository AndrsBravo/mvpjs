import Listr from "listr";
import { setDefaults } from "../utils.js";
import { callingConfigParams } from "../utils.js";
import { readingTemplateContent } from "../utils.js";
import { setUpFilePath } from "../utils.js";
import { fileTesting } from "../utils.js";
import { createDirAndFileTemplate } from "../utils.js";

export default async function creatingPage(options) {
  options.value = options.page;
  options.target = "Page";
  options.templateDirName = "page/Page.js";
  options.templateName = "PageName";
  options.filePathName = "layout/page";

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
    },
  ]);

  await task.run();
}
