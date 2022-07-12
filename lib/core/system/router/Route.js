import routeId from "./routeId";
import Configuration from "../../../config/Configuration";

export default class {
  #location;
  #data;
  #page = null;
  #pageName;
  #params = null;
  #config;

  constructor(location) {
    this.#location = location;
    this.#setParams();
    this.#config = new Configuration();

  }

  routeId() {
    return this.#data.id;
  }
  async #setPage() {

    console.log("llega al set page");

    let { default: page } = await this.#config.routes[this.#data.pageRoute]();
    console.log(page);
    if (page) { this.#page = new page(); return; }


    if (!page) { this.#data.pageRoute = "notfoundpage"; }
    let { default: notfoundpage } = await this.#config.routes[this.#data.pageRoute]();
    this.#page = new notfoundpage();

  }
  async render(layout) {
    this.#data = await routeId(this.#location);
    await this.#setPage();
    this.#page.setName(this.#data.id);
    this.#page.meta({
      routeId: this.#data.id,
      pageRoute: this.#data.pageRoute,
      pageName: this.#pageName,
      pageMethod: this.#data.pageMethod,
      params: this.#params,
      href: this.#data.pathname.length > 1 && this.#data.pathname.startsWith("/")
        ? this.#data.pathname.substr(1) + this.#location.search
        : this.#data.pathname + this.#location.search,
    });
    this.#page.setLayout(layout);

    //If PageNotFound

    if (this.#data.pageRoute == "notfoundpage") {
      return;
    }

    //Know if method exist

    if (this.#page[this.#data.pageMethod] == undefined) {
      return;
    }

    await this.#page[this.#data.pageMethod](this.#params);
  }
  /**
   *
   * @returns {Page} page
   */
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
  #setParams() {
    const urlSearchParams = new URLSearchParams(this.#location.search);

    const data = {};

    for (const entry of urlSearchParams.entries()) {
      data[entry[0]] = entry[1];
    }
    this.#params = data;
  }
}
