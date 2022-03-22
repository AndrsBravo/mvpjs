import Template from "../../../../view/Template.js";
import html from "../../../../../builder/HtmlTemplateBuilder.js";

export default class extends Template {
  constructor() {
    super(
      "DefaultLayoutTemplate",
      html("div")
        .setSection("content")
        .setClass("w-full bg-slate-50 min-h-screen")
    );
  }
}
