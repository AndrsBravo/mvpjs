import html from "../../../../builder/htmltemplatebuilder.js";
import Template from "../../../view/Template.js";
export default class extends Template {
  constructor() {
    super(
      "BaseTemplate",
      html("div")
        .setClass("flex flex-columns h-100 bgwhite ofhidden")
        .setHTML([
          html("div")
            .setClass(
              "flex pt-color align-center justify-space-between pdd-10 hpx-40"
            )
            .setHTML([
              html("h5").setAttr("data-section", "title").setHTML("TITLE"),
              html("span").setClass("pddlr-5 pddtb-2 lh-1 hover").setHTML("x"),
            ]),
          html("div")
            .setClass("flex-1 pdd-5 margin-2")
            .setAttr("data-section", "content"),
        ])
        .getHTML()
    );
  }
}
