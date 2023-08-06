import Route from "./Route";
export default class {
  #layout;
  #routesMap = new Map();
  #routesHref = [];
  #currentRoute;
  #routeStatus = { active: 1, unactive: 0 };
  #homeRoute;

  constructor(layout) {
    this.#layout = layout;
  }

  async callCreateRoute(location) {

    const routePath = location.pathname + location.search;

    if (!this.#routesHref.includes(routePath)) await this.#addRoute(location);

    await this.#removeRouteHref(routePath);

    this.#routesHref.push(routePath);

    if (!this.#move()) return;
    this.#pushState(location);
  }

  async callRoute(location) {

    const routePath = location.pathname + location.search;

    if (!this.#removeRouteHref(routePath)) {
      this.#replaceState(this.#currentRoute.getData());
      return;
    }

    this.#routesHref.push(routePath);

    this.#move();
  }

  #pushState({ pathname, href }) {
    history.pushState({ page: pathname }, "", href);
  }

  #replaceState({ pathname, href }) {
    history.replaceState({ page: pathname }, "", href);
  }

  async #addRoute(location) {
    const route = new Route(location);
    await route.render(this.#layout);
    this.#routesMap.set(location.pathname + location.search, {
      route: route,
      status: this.#routeStatus.active,
    });
    route.getPage().meta({
      routeNotification: this.#showIfRegistered,
      unactivateRoute: this.#unactivateIfRegistered,
      redirectRoute: this.#redirectRoute,
    });

    if (location.pathname == "/") this.#homeRoute = route;

    return route;
  }

  async #showRoute(route) {
    if (!route) return false;
    this.#closeCurrent();
    route.getPage().show();
    this.#currentRoute = route;
    return true;
  }

  #redirectRoute = (url) => {

    console.log(location);

    // location.pathname + location.search


  }

  /**  
   * @param {String} routeId
   * @description href of route allready registre
   */
  #showIfRegistered = (routeId) => {
    let registeredRoute = this.#routesMap.get(routeId);

    if (registeredRoute.status == this.#routeStatus.unactive) return;
    registeredRoute = registeredRoute.route;

    this.#closeCurrent();
    registeredRoute.getPage().show();
    this.#currentRoute = registeredRoute;
    this.#replaceState({
      page: { page: registeredRoute.route.href },
      href: registeredRoute.route.href,
    });
  };

  #unactivateIfRegistered = async (routeId) => {
    this.#removeRouteHref(routeId);
    if (!this.#move()) return;
    this.#replaceState(this.#currentRoute.getData());
  };

  async #removeRouteHref(routeHref) {

    const index = this.#routesHref.indexOf(routeHref);
    console.log("El routeHref a eliminar", routeHref);
    console.log("Index a eliminar", index);
    console.log("Los routesHref", this.#routesHref);
    if (index < 0) return false;
    this.#routesHref.splice(index, 1);
    console.log("Los routesHref despues de eliminar", this.#routesHref);

    return true;
  }

  #closeCurrent() {
    if (this.#currentRoute) this.#currentRoute.getPage().hide();
  }

  #move() {

    if (this.#routesHref.length < 1) return false;
    const routeHref = this.#routesHref[this.#routesHref.length - 1];
    if (!this.#routesMap.has(routeHref)) return false;
    return this.#showRoute(this.#routesMap.get(routeHref).route);

  }
}
