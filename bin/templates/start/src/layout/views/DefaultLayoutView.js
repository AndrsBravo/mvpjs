import {View} from "mvp";
import DefaultLayoutTemplate from "./templates/DefaultLayoutTemplate";

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
