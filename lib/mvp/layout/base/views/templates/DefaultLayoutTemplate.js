import Template from "../../../../view/Template.js";
import html from "../../../../../builder/HtmlTemplateBuilder.js";

export default class extends Template {
  constructor() {
    super(
      "DefaultLayoutTemplate",
      div()
        .section("content")
        .class("w-full bg-slate-50 min-h-screen")
    );
  }
}
