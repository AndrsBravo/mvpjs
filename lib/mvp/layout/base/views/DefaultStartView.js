import View from "../../../view/View.js";
import { DefaultStartTemplate } from "./templates/DefaultStartTemplate.js";

export default class DefaultStartView extends View {
    constructor() {

        super({ name: "DefaultStartView", template: new DefaultStartTemplate() });

    }
}