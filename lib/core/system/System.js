import setUpSystemComponent from "./setUpSystemComponent";
import RouteService from "./router/RouteService";

export default class {
  static #layout;
  static #routeService;

  /**
   *
   * @param {Event} evt
   * @description Html load page Event
   */
  static async load(evt) {
    //console.log("load en el system");
    await setUpSystemComponent(document.body);
    await this.#routeService.callCreateRoute(window.location);
  }

  /**
   *
   * @param {Event} evt
   * @description Html popstate page Event
   */
  static async popstate(evt) {
   // console.log("Llega el popstate");
    await this.#routeService.callRoute(window.location);
  }

  /**
   *
   * @param {Layout} layout
   */
  static async layout({ layout }) {
    this.#layout = layout;
    this.#routeService = new RouteService(this.#layout);
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
}
