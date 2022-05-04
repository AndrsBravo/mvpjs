export default class {
  #pathname;
  #search;
  #href;
  #id;
  #page = null;
  #pageRute;
  #pageName;
  #pageMethod = "start";
  #params = null;

  constructor({ pathname, search, href }) {
    this.#href = href;
    this.#pathname = pathname;
    this.#search = search;
    this.#routeId({ pathname, search });
  }

  routeId() {
    return this.#id;
  }
  async #setPage() {
    //  console.log("Loasd page----");

    this.#pageName = Routes(this.#pageRute);

    if (!this.#pageName) {
      this.#pageRute = "notfoundpage";
      this.#pageName = Routes(this.#pageRute);
    }

    let { default: page } = await Import(this.#pageName);
    this.#page = new page();
  }

  async render(layout) {
    await this.#setPage();
    this.#page.setName(this.#id);
    this.#page.setLayout(layout);
    this.#page.meta({ routeId: this.#id, pageRute: this.#pageRute, pageName: this.#pageName, pageMethod: this.#pageMethod, params: this.#params, href: this.#href });

    //If PageNotFound

    if (this.#pageRute == "notfoundpage") {
      return;
    }

    //Know if method exist

    if (this.#page[this.#pageMethod] == undefined) {
      return;
    }

    this.#page[this.#pageMethod](this.#params);
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
  getHref(){
    return this.#href;
  }
  setLayout(layout) {
    this.#page.setLayout(layout);
  }
  #setParams(search) {
    const urlSearchParams = new URLSearchParams(search);

    const data = {};

    for (const entry of urlSearchParams.entries()) {
      data[entry[0]] = entry[1];
    }
    this.#params = data;
  }

  async #routeId({ pathname, search }) {
    this.#setParams(search);

    const route = [pathname, search];
    this.#pageRute = "home";

    let id = route.reduce((acum, value) => {
      acum = acum + value.trim().replace(" ", "_");
      return acum;
    }, "");

    id = [...id]
      .reduce((acum, item) => acum + 32 * item.charCodeAt(0), 1)
      .toString(36);

    if (pathname === "/") {
      this.#id = this.#pageRute + "_" + id;
      return;
    }

    const values = pathname.split("/");
    values.shift();

    if (values.length > 0) {
      this.#pageRute = values.shift();
    }
    if (values.length > 0) {
      this.#pageMethod = values.shift();
    }

    this.#id = this.#pageRute + "_" + id;
  }
}
