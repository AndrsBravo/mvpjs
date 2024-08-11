import Route from "lib/core/system/router/Route.js";
import { routeObject, locationPath } from "../routeArray";
import { Layout } from "lib/mvp/layout/Layout";
export default class {

  #layouts = new Map();
  #routesMap = new Map();
  #config;
  #routesHref = [];
  #currentRoute;
  #routeStatus = { active: 1, inactive: 0 };
  #homeRoute;

  constructor(config) {
    this.#config = config;
  }

  async callCreateRoute(location) {

    const routePath = locationPath(location);

    if (!this.#routesHref.includes(routePath)) await this.#addRoute(location);

    await this.#removeRouteHref(routePath);

    this.#routesHref.push(routePath);

    if (!this.#move()) return;
    this.#pushState(location);
  }

  async callRoute(location) {

    const routePath = locationPath(location);

    if (!this.#removeRouteHref(routePath)) {
      this.#replaceState(this.#currentRoute.getData());
      return;
    }

    this.#routesHref.push(routePath);

    this.#move();
  }
  #pushState({ pathname, href }) {
    //console.log("El pathname en el pushState", pathname);
    history.pushState({ page: pathname }, "", href);
  }

  #replaceState({ pathname, href }) {
    //console.log("El pathname en el replaceState", pathname);
    history.replaceState({ page: pathname }, "", href);
  }

  async #addRoute(location) {

    // const routePathArray = routeArray(location)
    const routeObj = routeObject(location, this.#config.routes)
    if (!this.#layouts.has(routeObj.path)) {
      const { default: RouteLayout } = routeObj.route.layout ? await routeObj.route.layout() : { default: null };
      this.#layouts.set(routeObj.path, RouteLayout ? new RouteLayout() : new Layout({ name: 'body_layout' }));
      await this.#layouts.get(routeObj.path).render()
    }

    const route = new Route(location, routeObj);
    await route.render(this.#layouts.get(routeObj.path));
    this.#routesMap.set(locationPath(location), {
      route: route,
      status: this.#routeStatus.active,
    });
    route.getPage().meta = {
      routeNotification: this.#showIfRegistered,
      deactivateRoute: this.#deactivateIfRegistered,
      redirectRoute: this.#redirectRoute,
    };

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

  #redirectRoute = (href) => {

    const url = new URL(href);
    this.callCreateRoute(url);
    this.#closeCurrent()

  }

  /**  
   * @param {String} routeId
   * @description href of route already registre
   */
  #showIfRegistered = (routeId) => {
    let registeredRoute = this.#routesMap.get(routeId);

    if (registeredRoute.status == this.#routeStatus.inactive) return;
    registeredRoute = registeredRoute.route;

    this.#closeCurrent();
    registeredRoute.getPage().show();
    this.#currentRoute = registeredRoute;
    this.#replaceState({
      page: { page: registeredRoute.route.href },
      href: registeredRoute.route.href,
    });
  };

  #deactivateIfRegistered = async (routeId) => {
    this.#removeRouteHref(routeId);
    if (!this.#move()) return;
    this.#replaceState(this.#currentRoute.getData());
  };

  async #removeRouteHref(routeHref) {

    const index = this.#routesHref.indexOf(routeHref);
    if (index < 0) return false;
    this.#routesHref.splice(index, 1);
    return true;
  }

  #closeCurrent() {
    //console.log("Closing current");
    //console.log(this.#currentRoute);
    if (this.#currentRoute) this.#currentRoute.getPage().hide();
  }

  #move() {

    if (this.#routesHref.length < 1) return false;
    const routeHref = this.#routesHref[this.#routesHref.length - 1];
    if (!this.#routesMap.has(routeHref)) return false;
    return this.#showRoute(this.#routesMap.get(routeHref).route);

  }
}
