#!/usr/bin/env node
import parser from "parser";

import Listr from "listr";

let result = parser(process.argv);
console.log(result);
callActions(result);

async function callActions(options) {
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



