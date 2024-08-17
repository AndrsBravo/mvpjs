import System from "../System";
import routeId from "./routeId";

export default class {
  #location;
  #data;
  #page = null;
  #pageName;
  #params = null;

  constructor(location, routeObj) {
    this.#location = location;
    this.routeObj = routeObj
  }

  routeId() {
    return this.#data.id;
  }
  async #setPage() {

    if (!this.routeObj.route.page) { this.#data.pageRoute = "'404'"; return; }
    let { default: page } = await this.routeObj.page();
    if (page) { this.#page = new page(); return; }

  }
  async render(layout) {

    this.#data = await routeId(this.#location);

    await this.#setPage();

    if (this.routeObj.pathArray[0] in this.#page) this.#data.pageMethod = this.routeObj.pathArray.shift();

    this.#page.name = this.#data.id;
    this.#page.meta = {
      routeId: this.#data.id,
      pageRoute: this.routeObj.locationPath,
      pageName: this.#pageName,
      pageMethod: this.#data.pageMethod,
      params: this.routeObj.pathArray,
      query: this.routeObj.query,
      href: this.#data.pathname + this.#location.search
    };

    await this.#page.setLayout(layout);

    //Know if method exist

    if (this.#page[this.#data.pageMethod] == undefined) {
      return;
    }

    await this.#page[this.#data.pageMethod]({ params: this.routeObj.pathArray, query: this.routeObj.query });
  }
  /** @returns {Page} page */
  getPage() {
    return this.#page;
  }
  getParams() {
    return this.#params;
  }
  getData() {
    return this.#data;
  }
  setLayout(layout) {
    this.#page.setLayout(layout);
  }

}
