import FormViewBase from "./FormViewBase.js";
import ViewBase from "./views/ViewBase.js";

export default class extends FormViewBase {
  /**
   *
   * @param {String} name
   */
  constructor(name) {
    super({ name: name, views: [new ViewBase()], target: "content" });
  }
}
