import Listr from "listr";
import {
  setDefaults,
  callingConfigParams,
  readingTemplateContent,
  setUpFilePath,
  setUpFilePathToBelong,
  setEntityToaModel,
  fileTesting,
  createDirAndFileTemplate,
  updateConfigResource,
  writeMvpConfig,
} from "../utils.js";

export default async function creatingModel(options) {
  options.value = options.model;
  options.target = "Model";
  options.templateDirName = "model/Model.js";
  options.templateName = "ModelName";
  options.filePathName = "models";

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
      enabled: () => options.belong,
    },
    {
      title: "Setting Up Model if belong to: ",
      task: () => setEntityToaModel(options),
      enabled: () => options.belong,
    },
    {
      title: "Testing File",
      task: () => fileTesting(options),
    },
    {
      title: "Creating files",
      task: () => createDirAndFileTemplate(options),
    },
    {
      title: "Update config resource",
      task: () => updateConfigResource(options),
    },
    {
      title: "ReWritting config file resource",
      task: () => writeMvpConfig(options),
    },
  ]);

  await task.run();
}

