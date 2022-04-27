import Page from "./Page.js";
import NotFoundView  from "./views/NotFoundView.js";

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
