import Listr from "listr";
import setAll from "./strategies/AllStrategy.js";
import initProject, { init } from "./strategies/InitStrategy.js";
import creatingLayout from "./strategies/LayoutStrategy.js";
import creatingEndPointCollection from "./strategies/EndPointCollectionStrategy.js";
import creatingModel from "./strategies/ModelStrategy.js";
import creatingPage from "./strategies/PageStrategy.js";
import creatingView from "./strategies/ViewStrategy.js";
import creatingTemplate from "./strategies/TemplateStrategy.js";
import recap from "./scripts/configRecap.js";
import setConfig from "./scripts/setConfig.js";
import setC from "./scripts/set.js"
import watch from "./scripts/watch.js"
import starters from "server/starters.js";

export default async function callActions(options) {
  const task = new Listr([
    {
      title: "Setting All",
      task: () => setAll(options),
      enabled: () => options.all,
    },
    {
      title: "Initialize project",
      task: () => init(options),
      enabled: () => options.init,
    },
    {
      title: "Creating Layout " + options.layout,
      task: () => creatingLayout(options),
      enabled: () => options.layout,
    },
    {
      title: "Creating EndPointCollection " + options.endpoint,
      task: () => creatingEndPointCollection(options),
      enabled: () => options.endpoint,
    },
    {
      title: "Creating Model " + options.model,
      task: () => creatingModel(options),
      enabled: () => options.model,
    },
    {
      title: "Creating Page " + options.page,
      task: () => creatingPage(options),
      enabled: () => options.page,
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
    {
      title: "Performing Recap Of " + options.recap,
      task: () => recap(options),
      enabled: () => options.recap,
    },
    {
      title: "Performing config",
      task: () => setConfig(options),
      enabled: () => options.config,
    },
    {
      title: "Set Config param",
      task: async () => setC(options),
      enabled: () => options.set,
    },
    {
      title: "Setting Watch Mode",
      task: async () => watch(options),
      enabled: () => options.watch,
    },
    {
      title: "  Start dev mode",
      task: async () => await starters.dev(options),
      enabled: () => options.dev,
    },
    {
      title: "Start production mode",
      task: async () => await starters.start(options),
      enabled: () => options.prod,
    },
    {
      title: "Building for production",
      task: async () => starters.build(options),
      enabled: () => options.build,
    },

  ]);

  await task.run().catch(error => { console.error(error); });
}
