import Layout from "../Layout.js";
import DefaultLayoutView from "./views/DefaultLayoutView.js";

export default class extends Layout {
  constructor() {
    super({
      name: "DefaultLayout",
      view: new DefaultLayoutView()
    });
  }

  start() {
    console.log("Se llama el start del layout");
    // this.addSection("content", new DefaultStartView());
  }
}
