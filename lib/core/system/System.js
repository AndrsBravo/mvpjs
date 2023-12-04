import RouteService from "./router/RouteService";

export default class {
  static #layout;
  /**@type {RouteService} */
  static #routeService;
  static #config;

  static set config(config) {
    this.#config = config;
  }
  static get config() { return this.#config; }
  /**
   *
   * @param {Event} evt
   * @description Html load page Event
   */
  static async load(evt) {
    await this.#routeService.callCreateRoute(window.location);
  }

  /**
   *
   * @param {Event} evt
   * @description Html popstate page Event
   */
  static async popstate(evt) {
    await this.#routeService.callRoute(window.location);
  }

  /** @param {Layout} layout */
  static async layout({ layout }) {
    this.#layout = new layout();
    this.#routeService = new RouteService(this.#layout);
    await this.#layout.render();
    this.#layout.start();
  }

  /**
   *
   * @param {URL} href
   * @description url from anchor to link pages
   */
  static async route(href) {
    const url = new URL(href);
    await this.#routeService.callCreateRoute(url);
  }

  static endPointResponse(response) {
    if (this.#layout) {
      this.#layout.endPointResponse(response);
    }

  }
}
