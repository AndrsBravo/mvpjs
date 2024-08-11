import chalk from "chalk";
import { toCapitalizeCase } from "../utils.js";

export default async function creatingEndPointCollection(options) {
  if (!options.name) {
    console.error("%s Name for EndPointCollection missed", chalk.bold.red(" ERROR "));
    console.error("  Use command like:");
    console.error("   mvp <name> --all");
    process.exit(1);
  }

  const capName = toCapitalizeCase(options.name);
  options.endpoint = capName + "EndPointCollection";
  options.belong = options.name.toLowerCase();
  options.page = capName + "Page";
  options.model = capName + "Model";
  options.view = capName + "View";
  options.template = capName + "Template";
}

