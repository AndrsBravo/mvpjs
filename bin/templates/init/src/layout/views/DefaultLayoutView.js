import { View } from "mvpjs";
import defaultLayoutTemplate from "./templates/layout.html";

export default class extends View {
  constructor() {
    super({
      name: "DefaultLayoutView",
      template: defaultLayoutTemplate,
      target: document.body,
      templateOption: "templateAdd",
    });
  }
}
