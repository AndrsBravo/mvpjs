import System from "../System";
import routeId from "./routeId";

export default class {
  #location;
  #data;
  #page = null;
  #pageName;
  #params = null;

  constructor(location) {
    this.#location = location;
  }

  routeId() {
    return this.#data.id;
  }
  async #setPage() {  

    if (!System.config.routes[this.#data.pageRoute]) {this.#data.pageRoute = "'404'"; return;}
    let { default: page } = await System.config.routes[this.#data.pageRoute]();
    if (page) { this.#page = new page(); return; }

  }
  async render(layout) {

    this.#data = await routeId(this.#location, System.config);
    await this.#setPage();

    console.log(this.#page)
    if (this.#data.values[0] in this.#page) this.#data.pageMethod = this.#data.values.shift();
    if (this.#data.values.length > 0) { if (Object.keys(this.#data.params) > 0) { this.#data.values.push(this.#data.params); } this.#data.params = this.#data.values; }

    this.#page.name = this.#data.id;
    this.#page.meta = {
      routeId: this.#data.id,
      pageRoute: this.#data.pageRoute,
      pageName: this.#pageName,
      pageMethod: this.#data.pageMethod,
      params: this.#data.params,
      href: this.#data.pathname + this.#location.search
    };

    await this.#page.setLayout(layout);

    //If PageNotFound

    if (this.#data.pageRoute == "notfoundpage") {
      return;
    }

    //Know if method exist

    if (this.#page[this.#data.pageMethod] == undefined) {
      return;
    }

    await this.#page[this.#data.pageMethod](this.#data.params);
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
