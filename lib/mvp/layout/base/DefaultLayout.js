import Layout from "../Layout.js";
import DefaultLayoutView from "./views/DefaultLayoutView.js"
import DefaultStartView from "./views/DefaultStartView.js";

export default class extends Layout {

    constructor() {

        super({ name: "DefaultLayout", views: [new DefaultLayoutView()], target: document.body });

    }

    start() {

        this.addSection("content", new DefaultStartView());

    }

}