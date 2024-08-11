import { Layout } from "mvpjs";
import DefaultLayoutView from "./views/DefaultLayoutView";
/**
 * @layout
 */
export default class extends Layout {
  constructor() {
    super({
      name: "DefaultLayout",
      view: new DefaultLayoutView()
    });
  }

  start() { }
}
