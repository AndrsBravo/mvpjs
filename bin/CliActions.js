import Listr from "listr";
import initProject from "./strategies/InitStrategy";
import creatingLayout from "./strategies/LayoutStrategy";
import creatingEntity from "./strategies/EntityStrategy";
import creatingModel from "./strategies/ModelStrategy";
import creatingPresenter from "./strategies/PresenterStrategy";
import creatingForm from "./strategies/FormStrategy";
import creatingView from "./strategies/ViewStrategy";
import creatingTemplate from "./strategies/TemplateStrategy";

export async function callActions(options) {
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
