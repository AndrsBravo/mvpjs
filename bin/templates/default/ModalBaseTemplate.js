import {Template} from "../../../view/Template.js";
import {html} from "/lib/builder/htmltemplatebuilder.js";
export default class extends Template {
  constructor() {
    super("ModalBaseTemplate");
  }

  getHTML() {
    html("div")
      .class(
        "absolute flex align-center justify-center w-100 h-100 bgmodal top-0 left-0"
      )
      .html(
        html("div")
          .class(
            "flex flex-columns bgwhite w-95 b1px bcolor maxw-600px minh-200px radiustop-7 ofhidden"
          )
          .html([
            html("div")
              .class(
                "flex pt-color align-center justify-space-between pdd-10 hpx-40 bbottom1px bcolor"
              )
              .html([
                html("h5").html("TITLE"),
                html("span")
                  .class("pddlr-5 pddtb-2 lh-1 b1px bcolor hover")
                  .html("x"),
              ]),
            html("div").class("flex-1 pdd-5 margin-2 b1px bcolor"),
          ])
      )
      .getHTML();
  }
}
