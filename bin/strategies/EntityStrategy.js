import Listr from "listr";
import { setDefaults } from "../utils.js";
import { capitalizeCaseValue } from "../utils.js";
import { callingConfigParams } from "../utils.js";
import { readingTemplateContent } from "../utils.js";
import { setUpFilePath } from "../utils.js";
import { fileTesting } from "../utils.js";
import { createDirAndFileTemplate } from "../utils.js";
import { updateConfigResource } from "../utils.js";
import { writeMvpConfig } from "../utils.js";

export default async function creatingEntity(options) {
  options.value = options.entity;
  options.target = "Entity";
  options.templateDirName = "entity/Entity.js";
  options.templateName = "EntityName";
  options.filePathName =  options.value.toLowerCase();

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
