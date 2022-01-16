import View from "../../view/View.js";
import ModalBaseTemplate from "./templates/ModalBaseTemplate.js";

export default class extends View {
    constructor() {
        super("ModalBaseView", new ModalBaseTemplate(), document.body, "templateAdd")
    }
}