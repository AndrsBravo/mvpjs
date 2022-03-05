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

export default async function creatingPresenter(options) {
  options.value = options.presenter;
  options.target = "Presenter";
  options.templateDirName = "presenter/Presenter.js";
  options.templateName = "PresenterName";
  options.filePathName = "presenters";

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
      title: "Setting Up route on config",
      task: () => setUpRoutes(options),
    },
    {
      title: "ReWritting config file resource",
      task: () => writeMvpConfig(options),
    },
  ]);

  await task.run();
}

async function creatingPresenterOld(options) {
  console.log("%s Creating Presenter propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "presenter/Presenter.js");
  if (!options.presenter) {
    console.error("%s Presenter Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  //const presenter = toCapitalizeCase(options.presenter);

  if (options.name) {
    console.log("El Name");
    console.log(options.name);
  }

  const config = await mvpConfig(options);
  const src = config.src || "src";
  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll(
      "PresenterName",
      options.presenter
    );
  } catch (ex) {}

  let filePath = path.resolve(options.cwd, src, "presenters");

  /* If want to add the presenter to especific place */
  let belong;
  if (options.belong && config.resources[options.belong]) {
    belong = config.resources[options.belong];

    belong = options.cwd + path.dirname(belong);
    filePath = path.resolve(belong, "presenters");
  }

  const file = path.resolve(filePath, `${options.presenter}.js`);
  const fileExists = fs.existsSync(file);

  if (fileExists) {
    console.log("-----The Presenter Exists");
    return;
  }

  fs.mkdirSync(filePath, { recursive: true }, (error) => {
    if (error) {
      console.error(
        `%s Could not create ${options.presenter} directory`,
        chalk.red.bold("ERROR")
      );
      return;
    }
  });
  fs.writeFile(file, templateContent, (error) => {
    if (error) {
      console.error(
        `%s Could not write Presenter ${options.presenter} content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(
      `%s Presenter ${options.presenter} created`,
      chalk.green.bold("DONE")
    );
  });

  config.resources[options.presenter.toLowerCase()] = file.replaceAll(
    options.cwd,
    ""
  );

  config.routes[options.name.toLowerCase() || options.presenter.toLowerCase()] =
    options.presenter;

  writeMvpConfig(options, config);
}

function setUpRoutes(options) {
  options.config.routes[
    options.name.toLowerCase() || options.presenter.toLowerCase()
  ] = options.presenter;
}
