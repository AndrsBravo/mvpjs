import View from "../../view/View.js";
import BaseTemplate from "./templates/BaseTemplate.js";
export default class extends View {

    constructor() {
        super({ name: "FormViewBase", template: new BaseTemplate(), target: "layout_content", templateOption: "templateAdd" });
    }
}