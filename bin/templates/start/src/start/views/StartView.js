import {View} from "mvp";
import WelcomePage from "./templates/WelcomePage.js";
export default class extends View {
  constructor() {
    super({
      name: "StartView",
      template: new WelcomePage(),
      templateOption: "templateAdd",
    });
  }
}
