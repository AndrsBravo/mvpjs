import Configuration from "../config/Configuration";
import System from "../core/system/System";

export default class extends Configuration {
  constructor({ layout, routes, resources }) {
    super({ layout, routes, resources });
    this.#applicationStart();
  }

  #applicationStart() {
    window.onload = System.load;

    window.addEventListener("load", this.#setLayout);

    window.onpopstate = async (evt) => {
      System.routes(window.location);
    };
  }

  /**
   *
   */
  #setLayout = () => {
    console.log("El layout");
    System.layout({ layout: this._layout, home: this._startPresenter });
  };
}
