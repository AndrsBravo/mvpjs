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
  options.belong = options.entity.toLowerCase();
  options.presenter = options.entity + "Prensenter";
  options.model = options.entity + "Model";
  options.view = options.entity + "View";
  options.template = options.entity + "Template";
}
