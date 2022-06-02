import Route from "./Route";
import routeId from "./routeId";
export default class {
  #layout;
  #routesMap = new Map();
  #routesIds = [];
  #routesHref = [];
  #homeRoute;
  #currentRoute;
  #routeStatus = { active: 1, unactive: 0 };

  constructor(layout) {
    this.#layout = layout;
  }

  async callCreateRoute(location) {
    const data = await routeId(location);
    if (!data) return;
    if (!data.id) return;

    if (this.#routesIds.indexOf(data.id) < 0) await this.#addRoute(location);

    this.#removeRouteId(data.id);

    this.#routesIds.push(data.id);
    if (!this.#move()) return;
    this.#pushState(location);
  }
  async callRoute(location) {
    console.log("callRoute");
    const data = await routeId(location);
    console.log(data);
    if (!data) return;
    if (!data.id) return;

    if (!this.#removeRouteId(data.id)) {
      this.#replaceState(this.#currentRoute.getData());
      return;
    }

    this.#routesIds.push(data.id);

    this.#move();
  }

  #removeRouteId(routeId) {
    const index = this.#routesIds.indexOf(routeId);
    if (index < 0) return false;
    this.#routesIds.splice(index, index + 1);
    return true;
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
    this.#routesMap.set(route.routeId(), {
      route: route,
      status: this.#routeStatus.active,
    });
    this.#routesHref.push(location.pathname);
    route.getPage().meta({
      routeNotification: this.#showIfRegistered,
      unactivateRoute: this.#unactivateIfRegistered,
    });

    if (location.pathname == "/") this.#homeRoute = route;

    return route;
  }

  async #showRoute(route) {
    if (!route) return false;
    console.log(route);
    this.#closeCurrent();
    route.getPage().show();
    this.#currentRoute = route;
    return true;
  }

  /**
   *
   * @param {String} routeId
   * @description href of route allready registre
   */
  #showIfRegistered = (routeId) => {
    let registreRoute = this.#routesMap.get(routeId);

    if (registreRoute.status == this.#routeStatus.unactive) return;
    registreRoute = registreRoute.route;

    this.#closeCurrent();
    registreRoute.getPage().show();
    this.#currentRoute = registreRoute;
    this.#replaceState({
      page: { page: registreRoute.route.href },
      href: registreRoute.route.href,
    });
    console.log(history.length);
  };

  #unactivateIfRegistered = async (routeId) => {
    this.#removeRouteId(routeId);

    if (!this.#move()) return;
    this.#replaceState(this.#currentRoute.getData());
  };

  #closeCurrent() {
    if (this.#currentRoute) this.#currentRoute.getPage().hide();
  }

  #move() {
    if (this.#routesIds.length < 1) return false;
    const routeId = this.#routesIds[this.#routesIds.length - 1];
    if (!this.#routesMap.has(routeId)) return false;
    return this.#showRoute(this.#routesMap.get(routeId).route);
  }
}
