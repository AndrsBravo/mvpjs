import View from "../../view/View.js";
import NotFoundTemplate from "./templates/NotFoundTemplate.js";
export default class extends View {
  constructor() {
    super({
      name: "NotFoundView",
      template: new NotFoundTemplate(),
      templateOption: "templateAdd",
    });
  }
}
