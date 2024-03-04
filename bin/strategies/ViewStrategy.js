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

export default async function creatingView(options) {
  options.value = options.view;
  options.target = "View";
  options.templateDirName = "view/View.js";
  options.templateName = "ViewName";
  options.filePathName = "views";

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
  ]);

  await task.run();
}

async function creatingViewOld(options) {
  console.log("%s Creating View process here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "view/View.js");
  if (!options.view) {
    console.error("%s View Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const config = await mvpConfig(options);
  const src = config.src || "src";

  //const view = toCapitalizeCase(options.view);

  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll("ViewName", options.view);
  } catch (ex) { }

  let filePath = path.resolve(options.cwd, src, "views");

  /* If want to add the view to specific place */
  let belong;
  if (options.belong && config.resources[options.belong]) {
    belong = config.resources[options.belong];

    belong = options.cwd + path.dirname(belong);
    filePath = path.resolve(belong, "views");
  }

  const file = path.resolve(filePath, `${options.view}.js`);
  const fileExists = fs.existsSync(file);

  if (fileExists) {
    console.log("-----The View Exists");
    return;
  }

  fs.mkdirSync(filePath, { recursive: true }, (error) => {
    if (error) {
      console.error(
        `%s Could not create ${options.view} directory`,
        chalk.red.bold("ERROR")
      );
      return;
    }
  });
  fs.writeFile(file, templateContent, (error) => {
    if (error) {
      console.error(
        `%s Could not write View ${options.view} content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(`%s View ${options.view} created`, chalk.green.bold("DONE"));
  });

  config.resources[options.view.toLowerCase()] = file.replaceAll(
    options.cwd,
    ""
  );

  writeMvpConfig(options, config);
}
