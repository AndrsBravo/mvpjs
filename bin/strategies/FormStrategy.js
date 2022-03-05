import Listr from "listr";
import { setDefaults } from "../utils.js";
import { callingConfigParams } from "../utils.js";
import { readingTemplateContent } from "../utils.js";
import { setUpFilePath } from "../utils.js";
import { fileTesting } from "../utils.js";
import { createDirAndFileTemplate } from "../utils.js";

export default async function creatingForm(options) {
  options.value = options.form;
  options.target = "Form";
  options.templateDirName = "form/Form.js";
  options.templateName = "FormName";
  options.filePathName = "layout/formview";

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
  ]);

  await task.run();
}

function creatingFormOld(options) {
  console.log("%s Creating Form propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "form/Form.js");
  if (!options.form) {
    console.error("%s Form Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  //const form = toCapitalizeCase(options.form);

  const config = mvpConfig(options);
  const src = config.src || "src";

  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll("FormName", options.form);
  } catch (ex) {}

  const filePath = path.resolve(options.cwd, src, "layout/formview");

  const file = path.resolve(filePath, `${options.form}.js`);
  const fileExists = fs.existsSync(file);

  if (fileExists) {
    console.log("-----The Form Exists");
    return;
  }

  fs.mkdirSync(filePath, { recursive: true }, (error) => {
    if (error) {
      console.error(
        `%s Could not create ${options.form} directory`,
        chalk.red.bold("ERROR")
      );
      return;
    }
  });
  fs.writeFile(file, templateContent, (error) => {
    if (error) {
      console.error(
        `%s Could not write Form ${options.form} content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(`%s Form ${options.form} created`, chalk.green.bold("DONE"));
  });
}
