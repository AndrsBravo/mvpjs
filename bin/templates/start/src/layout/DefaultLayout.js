import {Layout} from "mvp";
import DefaultLayoutView from "./views/DefaultLayoutView";

export default class extends Layout {
  constructor() {
    super({
      name: "DefaultLayout",
      view: new DefaultLayoutView()
    });
  }

  start() {  }
}
