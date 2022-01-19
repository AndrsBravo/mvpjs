import { View } from "mvp";
import { TemplateTemplate } from "./templates/{TemplateTemplate}.js";

export default class extends View {
  constructor() {
    super({
      name: "{TemplateTemplate}",
      template: new {TemplateTemplate}(),
      target: "content",
      templateOption: "templateAdd",
    });
  }
}
