import Route from "./Route";
import setUpSystemComponent from "./setUpSystemComponent";

export default class {
  static #layout;
  static _routes = new Map();
  
  static async load() {
    await setUpSystemComponent(document.body);
  }
  /**
   *
   * @param {Layout} layout
   */
  static async layout({ layout }) {
    this.#layout = layout;
  }

  static async routes() {
    const route = new Route(window.location);
    console.log("Esta ruta");
    console.log(route);
    if (!this._routes.has(route.getRouteId())) {
      this._routes.set(route.getRouteId(), route);
      route.render(this.#layout);
    }
  }
}
