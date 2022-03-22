import Configuration from "../config/Configuration";
import System from "../core/system/System";
import DefaultLayout from "../mvp/layout/base/DefaultLayout";
import PageStart from "../mvp/page/StartPage";

export default class extends Configuration {
  constructor({ layout, routes, resources }) {
    super({ layout, routes, resources });
    this.#init();
  }

  #init() {
    window.onload = System.load;

    window.addEventListener("load", this.#setLayout);

    window.onpopstate = async (evt) => {
      System.routes(window.location);
    };
  }

  /**
   *
   */
  #setLayout = async () => {
    console.log("Desde el init");
    if (this._layout) {
      const { default: layout } = await Import(this._layout.toLowerCase());
      this._layout = layout;
      console.log("El layouts");
      console.log(this._layout);
    }
    if (this._startPresenter) {
      const { default: presenter } = await Import(
        this._startPresenter.toLowerCase()
      );
      this._startPresenter = presenter;
      console.log("El home");
      console.log(this._startPresenter);
    }

    this._layout = this._layout ? new this._layout() : new DefaultLayout();
    this._startPresenter = this._startPresenter
      ? new this._startPresenter()
      : new PageStart();

    System.layout({ layout: this._layout, home: this._startPresenter });
  };
}
