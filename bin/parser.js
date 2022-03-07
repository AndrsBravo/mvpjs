import arg from "arg";
export default function (args) {
  return parseArgumentsIntoOptions(args);
}

function parseArgumentsIntoOptions(rawArgs) {
  let args = {};
  try {
    args = arg(
      {
        "--all": Boolean,
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
        "-all": "--all",
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
  } catch (error) {
    console.error(`unknown or unexpected option: ${rawArgs.slice(2)}`);
    process.exit(1);
  }

  return {
    all: args["--all"] || false,
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
