import fs from "fs";
import chalk from "chalk";
import Listr from "listr";
import { promisify } from "util";
import { copyTemplateFiles } from "../utils.js";
import { setDefaults } from "../utils.js";
import { getTemplateDirectory } from "../utils.js";
import inquirer from "inquirer";
import constants from "bin/scripts/constants.js";

const access = promisify(fs.access);

export default async function initProject(options) {
  options.templateDirName = "start";

  //console.log("Initializing project");
  const task = new Listr([
    {
      title: "Setting Up directory path",
      task: () => getTemplateDirectory(options),
    },
    {
      title: "Creating Up and copy start files",
      task: () => setUp(options),
    },
  ]);

  await task.run();
  //console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}

async function setUp({ templateDirectory, copyTo }) {
  try {

    await access(templateDirectory, fs.constants.R_OK);
    await copyTemplateFiles({ templateDirectory, copyTo });
  } catch (error) {
    console.error("%s Invalid template location ", chalk.red.bold("ERROR"));
    console.error(error);
    process.exit(1);
  }
}


export async function init(options) {

  await getTemplateDirectory(options)

  let result = { templateDirectory: options.templateDirectory, copyTo: '' };

  const questions = [
    {
      type: "list",
      name: "mode",
      message: "Select init configuration mode",
      choices: ['front-end', 'back-end', 'full-stack'],
      default: 'front-end'
    }
  ]

  const backEndQ = [

    {
      type: "list",
      name: 'server',
      message: "Select nodejs HTTP FrameWork",
      choices: ['express', 'fastify']
    }

  ]

  const as = async (questions) => {
    return await inquirer.prompt(questions)
  }

  const inquirerStrategy = {

    'back-end': () => as(backEndQ),
    'front-end': () => '',
    'full-stack': () => as(backEndQ)

  }

  function setScripts() {
    const packagePath = options.cwd + "/package.json";

    if (!fs.existsSync(packagePath)) throw new Error("package.json was not found")

    let packageJson = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf-8' }));

    if (!packageJson.scripts) packageJson.scripts = {};

    for (const key in constants.NPM.SCRIPTS) {
      packageJson.scripts[key] = constants.NPM.SCRIPTS[key];
    };

    fs.writeFileSync(packagePath, JSON.stringify(packageJson), { encoding: 'utf-8' })

  }
  async function start() {

    return setUp({ templateDirectory: options.templateDirectory + '/start', copyTo: options.cwd })

  }

  async function frontEnd() {

    return setUp({ templateDirectory: options.templateDirectory + '/src', copyTo: options.cwd + "/src" })

  }

  async function backEnd(o) {

    await setUp({ templateDirectory: options.templateDirectory + '/backend', copyTo: options.cwd + "/backend" })
    setUp({ templateDirectory: options.templateDirectory + `/${o.server}`, copyTo: options.cwd + "/backend/server" })

  }

  async function frontClient(o) {

    await setUp({ templateDirectory: options.templateDirectory + '/frontend', copyTo: options.cwd + "/frontend" })
    setUp({ templateDirectory: options.templateDirectory + "/src", copyTo: options.cwd + "/frontend/client" })


  }

  async function fullStack(o) {

    frontClient(o)
    backEnd(o)

  }

  const initStrategy = {

    start,
    'back-end': backEnd,
    'front-end': frontEnd,
    'full-stack': fullStack,

  }

  inquirer.prompt(questions).then(async (answers) => {

    const r = await inquirerStrategy[answers.mode]()
    result = { ...result, ...answers, ...r };

    await initStrategy.start();
    await initStrategy[result.mode](result);
    setScripts()

  })


}