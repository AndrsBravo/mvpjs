import { Presenter } from "../presenters/Presenter.js";

export class Layout extends Presenter {

  /**
   * @param {Object} param
   * @param {string} param.name
   * @param {View} param.view
   */
  constructor({ name, view }) {
    super(name);
    this._views.push(view);
  }

  async render() {   
    for (const view of this._views) {
      view.setTarget(document.body);
      view.presenter = this;
      await view.render();
    };

  }

  start() {
    console.log("Se llama el start");
  }

}
