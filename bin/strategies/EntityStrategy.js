import Listr from "listr";
import { setDefaults } from "../utils";
import { capitalizeCaseValue } from "../utils";
import { callingConfigParams } from "../utils";
import { readingTemplateContent } from "../utils";
import { setUpFilePath } from "../utils";
import { fileTesting } from "../utils";
import { createDirAndFileTemplate } from "../utils";
import { updateConfigResource } from "../utils";
import { writeMvpConfig } from "../utils";

export async function creatingEntity(options) {
  options.value = options.entity;
  options.target = "Entity";
  options.templateDirName = "entity/Entity.js";
  options.templateName = "EntityName";
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
