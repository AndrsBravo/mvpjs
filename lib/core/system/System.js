import Route from "./Route";
import setUpSystemComponent from "./setUpSystemComponent";

export default class {
  static #layout;
  static _routes = new Map();

  /**
   *
   */
  static async load() {
    await setUpSystemComponent(document.body);
  }
  /**
   *
   * @param {Layout} layout
   */
  static async layout({ layout, home }) {
    this.#layout = layout;

    if (!home) {
      this.#layout.start();
      return;
    }

    if (window.location.pathname === "/") {
      const route = new Route(window.location);
      route.setPresenter(home);
      this._routes.set(route.getRouteId(), route);
      route.setLayout(this.#layout);
      console.log(await route.getPresenter());
    }

    //this.routes(window.location);
  }

  static async routes(url) {
    const route = new Route(url);
    console.log("Esta ruta");
    console.log(route);
    if (!this._routes.has(route.getRouteId())) {
      this._routes.set(route.getRouteId(), route);
      console.log(await route.getPresenter());
      route.setLayout(this.#layout);
    }
  }
  /*
  static route({ route, presenter, presenterName }) {
    const formView = new presenter();
    const formName = this.#presenterName({ route, presenterName });
    formView.setFormName(formName);
    formView.setLayout(this.#layout);
    formView[route.method](route.params);
  }
*/
}
