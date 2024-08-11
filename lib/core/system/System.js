import RouteService from "./router/RouteService";

export default class {

  /**@type {RouteService} */
  static #routeService;

  static set config(config) {
    this.#routeService = new RouteService(config);
  }

  /**
   * @param {Event} evt
   * @description Html load page Event
   */
  static async load(evt) {
    await this.#routeService.callCreateRoute(window.location);
  }

  /**
   * @param {Event} evt
   * @description Html popstate page Event
   */
  static async popstate(evt) {
    await this.#routeService.callRoute(window.location);
  }

  /**
   * @param {URL} href
   * @description url from anchor to link pages
   */
  static async route(href) {
    const url = new URL(href);
    await this.#routeService.callCreateRoute(url);
  }

  static endPointResponse(response) {
    /*  if (this.#layout) {
        this.#layout.endPointResponse(response);
      }*/

  }
}
