import Listr from "listr";
import { setDefaults } from "../utils.js";
import { callingConfigParams } from "../utils.js";
import { readingTemplateContent } from "../utils.js";
import { setUpFilePath } from "../utils.js";
import { setUpFilePathToBelong } from "../utils.js";
import { fileTesting } from "../utils.js";
import { createDirAndFileTemplate } from "../utils.js";
import { updateConfigResource } from "../utils.js";
import { writeMvpConfig } from "../utils.js";

export default async function creatingTemplate(options) {
  options.value = options.template;
  options.target = "Template";
  options.templateDirName = "view/html/Template.js";
  options.templateName = "ViewName";
  options.filePathName = "views/templates";

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
  ]);

  await task.run();
}

async function creatingTemplateOld(options) {
  console.log("%s Creating Template propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "view/html/Template.js");
  if (!options.template) {
    console.error("%s Template Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const config = await mvpConfig(options);
  const src = config.src || "src";

  //const template = toCapitalizeCase(options.template);

  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll(
      "TemplateName",
      options.template
    );
  } catch (ex) {}

  let filePath = path.resolve(options.cwd, src, "views/templates");

  /* If want to add the template to especific place */
  let belong;
  if (options.belong && config.resources[options.belong]) {
    belong = config.resources[options.belong];

    belong = options.cwd + path.dirname(belong);
    filePath = path.resolve(belong, "views/templates");
  }

  const file = path.resolve(filePath, `${options.template}.js`);
  const fileExists = fs.existsSync(file);

  if (fileExists) {
    console.log("-----The Template Exists");
    return;
  }

  fs.mkdirSync(filePath, { recursive: true }, (error) => {
    if (error) {
      console.error(
        `%s Could not create ${options.template} directory`,
        chalk.red.bold("ERROR")
      );
      return;
    }
  });
  fs.writeFile(file, templateContent, (error) => {
    if (error) {
      console.error(
        `%s Could not write Template ${options.template} content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(
      `%s Template ${options.template} created`,
      chalk.green.bold("DONE")
    );
  });
}
