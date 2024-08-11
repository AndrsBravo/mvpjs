import { View } from "mvpjs";
import notFoundTemplate from "./templates/not_found.html";
export default class extends View {
  constructor() {
    super({
      name: "NotFoundView",
      template: notFoundTemplate,
      templateOption: "templateAdd",
    });
  }
}
