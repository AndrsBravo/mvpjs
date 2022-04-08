import Page from "./Page.js";
import StartView from "./views/StartView.js";

export default class extends Page {
  /**
   * @param {String} name
   */
  constructor(name) {
    super({
      name: name,
      sections: { content: new StartView() },
    });
  }
}
