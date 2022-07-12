import {Template} from "mvp";
import {div} from "mvp";

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
