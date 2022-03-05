import Listr from "listr";
import { setDefaults } from "../utils";
import { callingConfigParams } from "../utils";
import { readingTemplateContent } from "../utils";
import { setUpFilePath } from "../utils";
import { fileTesting } from "../utils";
import { createDirAndFileTemplate } from "../utils";
import { updateConfigResource } from "../utils";
import { writeMvpConfig } from "../utils";

export function creatingLayout(options) {
  options.value = options.layout;
  options.target = "Layout";
  options.templateDirName = "layout/Layout.js";
  options.templateName = "LayoutName";
  options.filePathName = options.target.toLowerCase();

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
      title: "Setting Up layout on config",
      task: () => setLayoutToConfigFile(options),
    },
    {
      title: "ReWritting config file resource",
      task: () => writeMvpConfig(options),
    },
  ]);

  await task.run();
}

export function setLayoutToConfigFile(options) {
  options.config.layout = options.value;
}

export function creatingLayoutOld(options) {
  console.log("%s Creating Layout propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "layout/Layout.js");
  if (!options.layout) {
    console.error("%s Layout Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  //const layout = toCapitalizeCase(options.layout);

  const config = mvpConfig(options);
  const src = config.src || "src";
  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll("LayoutName", options.layout);
  } catch (ex) {}

  const filePath = path.resolve(options.cwd, src, "layout");

  const file = path.resolve(filePath, `${options.layout}.js`);
  const fileExists = fs.existsSync(file);

  if (fileExists) {
    console.log("-----The Layout Exists");
    return;
  }

  fs.mkdirSync(filePath, { recursive: true }, (error) => {
    if (error) {
      console.error(
        `%s Could not create ${options.layout} directory`,
        chalk.red.bold("ERROR")
      );
      return;
    }
  });
  fs.writeFile(file, templateContent, (error) => {
    if (error) {
      console.error(
        `%s Could not write Layout ${options.layout} content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(
      `%s Layout ${options.layout} created`,
      chalk.green.bold("DONE")
    );
  });

  config.resources[options.layout.toLowerCase()] = file.replaceAll(
    options.cwd,
    ""
  );

  config.resources["layout"] = options.layout;

  writeMvpConfig(options, config);
}
