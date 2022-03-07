import chalk from "chalk";
import { toCapitalizeCase } from "../utils.js";

export default async function creatingEntity(options) {
  if (!options.entity && !options.name) {
    console.error("%s Name for Entity missed", chalk.bold.red("ERROR"));
    console.error("  Use command like:");
    console.error("   mvp <name> --all");
    console.error("   mvp -e <name> --all");
    process.exit(1);
  }

  if (!options.entity) {
    options.entity = options.name;
  }

  options.entity = toCapitalizeCase(options.entity);
  options.belong = options.entity;
  options.presenter = options.entity + "Prensenter";
  options.view = options.entity + "View";
  options.template = options.entity + "Template";
}
