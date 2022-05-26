import routeId from "./routeId";
export default class {
  #location;
  #data;
  #page = null;
  #pageName;
  #params = null;

 constructor(location) {
   this.#location = location;
    this.#setParams();
  }

  routeId() {
    return this.#data.id;
  }
  async #setPage() {
    //  console.log("Loasd page----");

    console.log(this.#data);

    this.#pageName = Routes(this.#data.pageRoute);

    if (!this.#pageName) {
      this.#data.pageRoute = "notfoundpage";
      this.#pageName = Routes(this.#data.pageRoute);
    }

    let { default: page } = await Import(this.#pageName);
    this.#page = new page();
  }
  async render(layout) {
    this.#data = await routeId(this.#location);
    await this.#setPage();    
    this.#page.setName(this.#data.id);
    this.#page.meta({ routeId: this.#data.id, pageRoute: this.#data.pageRoute, pageName: this.#pageName, pageMethod: this.#data.pageMethod, params: this.#params, href: this.#data.pathname.startsWith("/")?this.#data.pathname.substr(1): this.#data.pathname });
    this.#page.setLayout(layout);

    //If PageNotFound

    if (this.#data.pageRoute == "notfoundpage") {
      return;
    }

    //Know if method exist

    if (this.#page[this.#data.pageMethod] == undefined) {
      return;
    }

    this.#page[this.#data.pageMethod](this.#params);
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
  getData() {return this.#data;}
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
