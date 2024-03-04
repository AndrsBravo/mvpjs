import arg from "arg";
import path from "node:path"
import { fileURLToPath } from "url";

export default function (args) {
  return parseArgumentsIntoOptions(args);
}

function parseArgumentsIntoOptions(rawArgs) {

  let args = {};
  try {
    args = arg(
      {
        "--dev": Boolean,
        "--start": Boolean,
        "--set": Boolean,
        "--all": Boolean,
        "--init": Boolean,
        "--layout": String,
        "--endpoint": String,
        "--model": String,
        "--page": String,
        "--view": String,
        "--template": String,
        "--html": String,
        "--belong": String,
        "--only": Boolean,
        "--recap": String,
        "--dir": String,
        "--config": Boolean,
        "--watch": Boolean,
        "-all": "--all",
        "-i": "--init",
        "-l": "--layout",
        "-e": "--endpoint",
        "-m": "--model",
        "-p": "--page",
        "-v": "--view",
        "-t": "--template",
        "-h": "--html",
        "-o": "--only",
        "-b": "--belong",
        "-r": "--recap",
        "-d": "--dir",
        "-c": "--config",
        "-s": "--set",
        "-w": "--watch",
      },
      {
        argv: rawArgs.slice(2),
      }
    );
  } catch (error) {
    console.error(error);
    //console.error(`unknown or unexpected option: ${rawArgs.slice(2)}`);
    process.exit(1);
  }

  return {
    dev: args["--dev"] || false,
    start: args["--start"] || false,
    all: args["--all"] || false,
    init: args["--init"] || false,
    layout: args["--layout"],
    endpoint: args["--endpoint"],
    model: args["--model"],
    page: args["--page"],
    view: args["--view"],
    template: args["--template"],
    html: args["--html"],
    belong: args["--belong"],
    recap: args["--recap"],
    dir: args["--dir"],
    only: args["--only"] || false,
    config: args["--config"] || false,
    set: args["--set"] || false,
    watch: args["--watch"] || false,
    name: args._[0],
    url: args._[1],
    cwd: process.cwd(),
    path: fileURLToPath(path.dirname(import.meta.url))
  };
}
