import Route from "./Route";
import setUpSystemComponent from "./setUpSystemComponent";

export default class {
  static #layout;
  static _routes = new Map();
  static current;

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
    console.log(window.history);
    const route = new Route(window.location);
    if (this._routes.has(route.routeId())) {
      this.#showIfRegistered(route.routeId());
      return;
    }

    this._routes.set(route.routeId(), route);
    await route.render(this.#layout);
    this.#closeCurrent();
    route.getPage().meta({ routeNotification: this.#showIfRegistered, removeRoute: this.#removeIfRegistered, });
    route.getPage().show();
    this.current = route;
  }
  static #showIfRegistered = (routeId) => {
    const registre = this._routes.get(routeId);
    this.#closeCurrent();
    registre.getPage().show();
    this.current = registre;
  };

  static   #removeIfRegistered =async (routeId) => {
    if (!this._routes.has(routeId)) {
      return;
    }

    console.log(this._routes);

    const routeToRemove = this._routes.get(routeId);

    await history.deleteUrl({url: routeToRemove.getHref()});   

    console.log(window.history);

    this._routes.delete(routeId);
  };

  static #closeCurrent() {
    if (this.current) this.current.getPage().hide();
  }
}
