import Template from "../../../../view/Template.js";
import html from "../../../../../builder/HtmlTemplateBuilder.js";

export default class extends Template {

    constructor() {

        super("DefaultLayoutTemplate", html("section").setClass("flex flex-columns h-100")
            .setHTML([
                html("header").setClass("flex align-center front justify-center w-100 hpx-50")
                    .setHTML(html("div").setHTML([ 
                        html("p").setClass("fsize-0-9em font-light pt-color").setSection("header").setHTML("Default Layout Header")
                    ])),
                html("main").setClass("flex-1").setSection("content"),
                html("footer").setClass("flex relative align-center front justify-center w-100 minh-40px")
                    .setHTML(html("div").setHTML(html("p").setClass("fsize-0-9em font-light pt-color").setSection("footer").setHTML("Default Layout Footer")))]));
    }

}