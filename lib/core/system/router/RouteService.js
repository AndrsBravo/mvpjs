import Route from "./Route";
export default class {
  #layout;
  #routesMap = new Map();
  #routesHref = [];
  #homeRoute;
  #currentRoute;
  #routeStatus = { active: 1, unactive: 0 };

  constructor(layout) {
    this.#layout = layout;
  }

  async callCreateRoute(location) {
   
    const { pathname, search } = location

    if (!this.#routesHref.includes(pathname + search)) await this.#addRoute(location);

    await this.#removeRouteHref(pathname + search);   

    this.#routesHref.push(pathname + search);
    
    if (!this.#move()) return;
    this.#pushState(location);
  }

  async callRoute(location) {

    const { pathname, search } = location   

    if (!this.#removeRouteHref(pathname + search)) {
      this.#replaceState(this.#currentRoute.getData());
      return;
    }

    this.#routesHref.push(pathname + search);

    this.#move();
  }

  async #removeRouteHref(routeHref) {

    const index = this.#routesHref.indexOf(routeHref);
    if (index < 0) return false;
    this.#routesHref.splice(index, 1);
   
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
    this.#routesMap.set(location.pathname + location.search, {
      route: route,
      status: this.#routeStatus.active,
    });
    route.getPage().meta({
      routeNotification: this.#showIfRegistered,
      unactivateRoute: this.#unactivateIfRegistered,
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

  /**  
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
  };

  #unactivateIfRegistered = async (routeId) => {
    this.#removeRouteHref(routeId);
    if (!this.#move()) return;
    this.#replaceState(this.#currentRoute.getData());
  };

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
