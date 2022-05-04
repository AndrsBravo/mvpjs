import Configuration from "../config/Configuration";
import System from "../core/system/System";
import DefaultLayout from "../mvp/layout/base/DefaultLayout";

export default class extends Configuration {
  constructor({ layout, routes, resources }) {
    super({ layout, routes, resources });
    this.#init();
  }

  #init() {
    window.onload = System.load;

    window.addEventListener("load", this.#setLayout);

    window.onpopstate = async (evt) => {
      console.log("----------------On popState----------");
      System.routes();
    };
  }

  /**
   *
   */
  #setLayout = async () => {
    //console.log("Desde el setLayout");
    if (this._layout) {
      const { default: layout } = await Import(this._layout.toLowerCase());
      this._layout = layout;
    }

    this._layout = this._layout ? new this._layout() : new DefaultLayout();

    System.layout({ layout: this._layout });
    System.routes(window.location);
  };
}
