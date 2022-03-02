#!/usr/bin/env node
//import parser from "parser";

import ncp from "ncp";
import arg from "arg";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { promisify } from "util";
import Listr from "listr";

const access = promisify(fs.access);
const copy = promisify(ncp);

let result = parseArgumentsIntoOptions(process.argv);
console.log(result);
callActions(result);

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--init": Boolean,
      "--layout": String,
      "--entity": String,
      "--model": String,
      "--presenter": String,
      "--form": String,
      "--view": String,
      "--template": String,
      "--belong": String,
      "--only": Boolean,
      "-i": "--init",
      "-l": "--layout",
      "-e": "--entity",
      "-m": "--model",
      "-p": "--presenter",
      "-f": "--form",
      "-v": "--view",
      "-t": "--template",
      "-o": "--only",
      "-b": "--belong",
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    init: args["--init"] || false,
    layout: args["--layout"],
    entity: args["--entity"],
    model: args["--model"],
    presenter: args["--presenter"],
    form: args["--form"],
    view: args["--view"],
    template: args["--template"],
    belong: args["--belong"],
    only: args["--only"] || false,
    name: args._[0],
    url: args._[1],
    cwd: process.cwd(),
  };
}

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.cwd, {
    clobber: false,
  });
}

function getTemplateDirectory(options, directory) {
  const filepath = new URL(import.meta.url).pathname.substring(1);

  options.templateDirectory = path.resolve(
    filepath,
    "../../lib/templates",
    directory
  );

  return options;
}

export async function initProject(options) {
  options = getTemplateDirectory(options, "start");

  try {
    console.log(options.templateDirectory);
    await access(options.templateDirectory, fs.constants.R_OK);
    copyTemplateFiles(options);
  } catch (error) {
    console.error("%s Invalid template name ", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}

async function callActions(options) {
  const task = new Listr([
    {
      title: "Initialize project",
      task: () => initProject(options),
      enabled: () => options.init,
    },
    {
      title: "Creating Layout " + options.layout,
      task: () => creatingLayout(options),
      enabled: () => options.layout,
    },
    {
      title: "Creating Entity " + options.entity,
      task: () => creatingEntity(options),
      enabled: () => options.entity,
    },
    {
      title: "Creating Model " + options.model,
      task: () => creatingModel(options),
      enabled: () => options.model,
    },
    {
      title: "Creating Presenter " + options.presenter,
      task: () => creatingPresenter(options),
      enabled: () => options.presenter,
    },
    {
      title: "Creating Form " + options.form,
      task: () => creatingForm(options),
      enabled: () => options.form,
    },
    {
      title: "Creating View " + options.view,
      task: () => creatingView(options),
      enabled: () => options.view,
    },
    {
      title: "Creating Template " + options.template,
      task: () => creatingTemplate(options),
      enabled: () => options.template,
    },
  ]);

  await task.run();
}

function initializingProject() {
  console.log(" > Initializing project propcess here!");
}

function toCapitalizeCase(text) {
  return (
    text.trim().charAt(0).toUpperCase() + text.trim().substr(1).toLowerCase()
  );
}

function creatingLayout(options) {
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

  writeMvpConfig(config);
}

async function creatingEntity(options) {
  console.log("%s Creating Entity propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "entity/Entity.js");

  if (!options.entity) {
    console.error("%s Entity Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const entity = toCapitalizeCase(options.entity);

  const config = mvpConfig(options);
  const src = config.src || "src";
  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll("EntityName", entity);
  } catch (ex) {}

  const filePath = path.resolve(options.cwd, src, options.entity.toLowerCase());

  const file = path.resolve(filePath, `${entity}.js`);
  const fileExists = fs.existsSync(file);

  if (fileExists) {
    console.log("-----The Entity Exists");
    return;
  }

  fs.mkdirSync(filePath, { recursive: true }, (error) => {
    if (error) {
      console.error(
        `%s Could not create ${options.entity} directory`,
        chalk.red.bold("ERROR")
      );
      return;
    }
  });

  fs.writeFileSync(file, templateContent, (error) => {
    if (error) {
      console.error(
        `%s Could not write Entity ${options.entity} content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(
      `%s Entity ${options.entity} created`,
      chalk.green.bold("DONE")
    );
  });

  //let config = await mvpConfig(options);

  config.resources[options.entity.toLowerCase()] = file.replaceAll(
    options.cwd,
    ""
  );

  writeMvpConfig(config);
}

function creatingModel(options) {
  console.log("%s Creating Model propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "model/Model.js");
  if (!options.model) {
    console.error("%s Model Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  //const entity = toCapitalizeCase(options.entity);

  const config = mvpConfig(options);
  const src = config.src || "src";
  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll("ModelName", options.model);
  } catch (ex) {}

  const filePath = path.resolve(options.cwd, src, "models");

  /* If want to add the model to especific place */
  let belong;
  if (options.belong && config.resources[options.belong]) {
    belong = config.resources[options.belong];

    belong = options.cwd + path.dirname(belong);
    filePath = path.resolve(belong, "model");
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

  writeMvpConfig(config);
}

function creatingPresenter(options) {
  console.log("%s Creating Presenter propcess here!", chalk.blue.bold(">"));
  options = getTemplateDirectory(options, "presenter/Presenter.js");
  if (!options.presenter) {
    console.error("%s Presenter Name missed", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  //const presenter = toCapitalizeCase(options.presenter);

  const config = mvpConfig(options);
  const src = config.src || "src";
  let templateContent;

  try {
    templateContent = fs.readFileSync(options.templateDirectory, "utf8");
    templateContent = templateContent.replaceAll(
      "PresenterName",
      options.presenter
    );
  } catch (ex) {}

  const filePath = path.resolve(options.cwd, src, "presenters");

  /* If want to add the presenter to especific place */
  let belong;
  if (options.belong && config.resources[options.belong]) {
    belong = config.resources[options.belong];

    belong = options.cwd + path.dirname(belong);
    filePath = path.resolve(belong, "presenter");
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

  config.resources["presenter"] = options.presenter;

  writeMvpConfig(config);
}

function creatingForm(options) {
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

async function creatingView(options) {
  console.log("%s Creating View propcess here!", chalk.blue.bold(">"));
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
  } catch (ex) {}

  let filePath = path.resolve(options.cwd, src, "views");

  /* If want to add the view to especific place */
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

  writeMvpConfig(config);
}

async function creatingTemplate(options) {
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

async function mvpConfig(options) {
  const configUrl = path.resolve(options.cwd, "mvp.config.js");
  let config = await import("file:///" + configUrl);
  return config.default;
}

function writeMvpConfig(config) {
  const configUrl = path.resolve(options.cwd, "mvp.config.js");
  const configContent = `export default ${JSON.stringify(config)}`;

  fs.writeFileSync(configUrl, configContent, (error) => {
    if (error) {
      console.error(
        `%s Could not ReWrite Config content`,
        chalk.red.bold("ERROR")
      );
      return;
    }
    console.log(`%s Config File ReWrited`, chalk.green.bold("DONE"));
  });
}
