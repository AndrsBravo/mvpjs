import Listr from "listr";
import setAll from "./strategies/AllStrategy.js";
import initProject from "./strategies/InitStrategy.js";
import creatingLayout from "./strategies/LayoutStrategy.js";
import creatingEntity from "./strategies/EntityStrategy.js";
import creatingModel from "./strategies/ModelStrategy.js";
import creatingPresenter from "./strategies/PresenterStrategy.js";
import creatingForm from "./strategies/FormStrategy.js";
import creatingView from "./strategies/ViewStrategy.js";
import creatingTemplate from "./strategies/TemplateStrategy.js";

export default async function callActions(options) {
  const task = new Listr([
    {
      title: "Setting All",
      task: () => setAll(options),
      enabled: () => options.all,
    },
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
