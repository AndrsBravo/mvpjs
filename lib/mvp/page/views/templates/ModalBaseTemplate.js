import Template from "../../../view/Template.js";
import html from "../../../../builder/htmltemplatebuilder.js";
export default class extends Template {
  constructor() {
    super("ModalBaseTemplate");
  }

  getHTML() {
    html("div")
      .setClass(
        "absolute flex align-center justify-center w-100 h-100 bgmodal top-0 left-0"
      )
      .setHTML(
        html("div")
          .setClass(
            "flex flex-columns bgwhite w-95 b1px bcolor maxw-600px minh-200px radiustop-7 ofhidden"
          )
          .setHTML([
            html("div")
              .setClass(
                "flex pt-color align-center justify-space-between pdd-10 hpx-40 bbottom1px bcolor"
              )
              .setHTML([
                html("h5").setHTML("TITLE"),
                html("span")
                  .setClass("pddlr-5 pddtb-2 lh-1 b1px bcolor hover")
                  .setHTML("x"),
              ]),
            html("div").setClass("flex-1 pdd-5 margin-2 b1px bcolor"),
          ])
      )
      .getHTML();
  }
}
