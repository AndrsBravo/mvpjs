import Listr from "listr";
import { setDefaults } from "../utils.js";
import { capitalizeCaseValue } from "../utils.js";
import { callingConfigParams } from "../utils.js";
import { readingTemplateContent } from "../utils.js";
import { setUpFilePath } from "../utils.js";
import { fileTesting } from "../utils.js";
import { createDirAndFileTemplate } from "../utils.js";

export default async function creatingEndPointCollection(options) {
  options.value = options.endpoint;
  options.target = "EndPointCollection";
  options.templateDirName = "endpoint/EndPointCollection.js";
  options.templateName = "EndPointCollectionName";
  options.filePathName = options.value.toLowerCase();

  const task = new Listr([
    {
      title: "Set defaults of " + options.value,
      task: () => setDefaults(options),
    },
    {
      title: "Capitalize Name: " + options.value,
      task: () => capitalizeCaseValue(options),
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
