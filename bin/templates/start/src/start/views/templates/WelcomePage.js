import { Template, section,div,h1 } from "mvp";
export default class extends Template {
  constructor() {
    super(
      "WelcomePage",
      section()
        .class(
          "flex justify-center w-full bg-white border border-slate-200 min-h-full"
        )
        .html(
          div()
            .class("p-8 flex items-center justify-center text-blue-500")
            .html([
              div().class("font-extrabold text-6xl").html("MVP"),
              h1().class("bg-blue-500 text-white").html("FORM"),
            ])
        )
    );
  }
}
