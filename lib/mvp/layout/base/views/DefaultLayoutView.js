import View from "../../../view/View.js";
import DefaultLayoutTemplate from "./templates/DefaultLayoutTemplate.js";

export default class extends View {
  constructor() {
    super({
      name: "DefaultLayoutView",
      template: new DefaultLayoutTemplate(),
      target: document.body,
      templateOption: "templateAdd",
    });
  }
}
