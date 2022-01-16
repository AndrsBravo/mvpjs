import Template from "../../../../view/Template.js";
import html from "../../../../../builder/HtmlTemplateBuilder.js";  

export class DefaultStartTemplate extends Template {
    constructor() {
        super("DefaultStartTemplate", html("div").setClass("flex flex-columns justify-center align-center pt-color h-100")
            .setHTML([
                html("h1").setHTML("Welcome"),
                html("p").setClass("font-xlight")
                    .setHTML([
                        "Start view ",  
                        html("span").setClass("font-bold").setHTML("mvp.js"),
                        " Framework"
                    ])]));
    }
}
