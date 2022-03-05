import arg from "arg";
export default function (args) {
  return parseArgumentsIntoOptions(args);
}

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
