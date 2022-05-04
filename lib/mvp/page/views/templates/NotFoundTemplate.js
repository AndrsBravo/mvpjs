import html from "../../../../builder/htmltemplatebuilder.js";
import Template from "../../../view/Template.js";
export default class extends Template {
  constructor() {
    super(
      "WelcomePage",
      html("section")
        .setClass(
          "flex justify-center w-full bg-white border border-slate-200 min-h-full"
        )
        .setHTML(
          html()
            .setClass("p-8 flex items-center justify-center text-blue-500")
            .setHTML([
              html("div").setClass("font-extrabold text-6xl").setHTML("MVP"),
              html("h1").setClass("bg-blue-500 text-white").setHTML("PAGE NOT FOUND"),
            ])
        )
    );
  }
}
