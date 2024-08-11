import { View } from "mvpjs";
import welcomePage from "./templates/welcome.html";
export default class extends View {
  constructor() {
    super({
      name: "StartView",
      template: welcomePage,
      templateOption: "templateAdd",
    });
  }
}
