import { Page } from "mvpjs";
import StartView from "../views/StartView.js";
/**
 * @page(/)
 */
export default class extends Page {
  #counter = 1;
  /**
   * @param {String} name
   */
  constructor(name) {
    super({
      name: name,
      sections: { content: new StartView() },
    });
  }

  counter_event() {

    this.ids.display.textContent = this.#counter;
    this.#counter++;
  }
}
