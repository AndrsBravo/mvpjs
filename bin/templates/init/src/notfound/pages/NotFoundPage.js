import { Page } from "mvpjs";
import NotFoundView from "../views/NotFoundView.js";

/**
 * @page(/not_found)
 */
export default class extends Page {
  /**
   * @param {String} name
   */
  constructor(name) {
    super({
      name: name,
      sections: { content: new NotFoundView() },
    });
  }
}
