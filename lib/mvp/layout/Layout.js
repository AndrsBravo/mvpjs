import { Presenter } from "../presenters/Presenter.js";
import { View } from "../view/View.js";

export class Layout extends Presenter {

  /**
   * @param {Object} param
   * @param {string} param.name
   * @param {View} param.view
   */
  constructor({ name, view }) {
    super(name);
    view ? this._views.push(view) : this._views.push(new View({ name: 'body_view' }));
  }

  async render() {

    //console.log(this._views);

    //console.log("-----------Rendering layout");
    for (const view of this._views) {
      view.target = document.body;
      view.page = this;
      await view.render();
    }

  }

  start() { }

  endPointResponse(response) {

    if (response.status == 401) {

      this.ids.login_dialog.showModal();
    }

    if (response.status == 200 && this.ids.login_dialog.open) {

      this.ids.login_dialog.close();
    }
  }

  async login_submit({ data }) {
    //console.log("Esta es la data del submit");
    //console.log(data);
  }

}
