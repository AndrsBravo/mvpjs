import Listr from "listr";
import { setDefaults } from "../utils";
import { callingConfigParams } from "../utils";
import { readingTemplateContent } from "../utils";
import { setUpFilePath } from "../utils";
import { setUpFilePathToBelong } from "../utils";
import { fileTesting } from "../utils";
import { createDirAndFileTemplate } from "../utils";
import { updateConfigResource } from "../utils";
import { writeMvpConfig } from "../utils";

export async function creatingModel(options) {
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

async function creatingModelOld(options) {
  console.log("%s Creating Model propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "model/Model.js");
  if (!options.model) {
    console.error("%s Model Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  //const entity = toCapitalizeCase(options.entity);

  const config = await mvpConfig(options);
  const src = config.src || "src";
  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll("ModelName", options.model);
  } catch (ex) {}

  let filePath = path.resolve(options.cwd, src, "models");

  /* If want to add the model to especific place */
  let belong;
  if (options.belong && config.resources[options.belong]) {
    belong = config.resources[options.belong];

    belong = options.cwd + path.dirname(belong);
    filePath = path.resolve(belong, "models");
  }

  const file = path.resolve(filePath, `${options.model}.js`);
  fs.mkdirSync(filePath, { recursive: true }, (error) => {
    if (error) {
      console.error(
        `%s Could not create ${filePath} directory`,
        chalk.red.bold("ERROR")
      );
      return;
    }
  });
  fs.writeFile(file, templateContent, (error) => {
    if (error) {
      console.error(
        `%s Could not write Model ${options.model} content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(`%s Model ${options.model} created`, chalk.green.bold("DONE"));
  });

  config.resources[options.model.toLowerCase()] = file.replaceAll(
    options.cwd,
    ""
  );

  writeMvpConfig(options, config);
}
