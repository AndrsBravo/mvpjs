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

  endPointResponse(response) {

    if (response.status == 401) {

      this.ids.login_dialog.showModal();
    }

    if (response.status == 200 && this.ids.login_dialog.open) {

      this.ids.login_dialog.close();
    }

    console.log("El response en el system");
    console.log(response);
  }

  async login_submit({ data }) {
    console.log("Esta es la data del sub mit");
    console.log(data);
  }

}
