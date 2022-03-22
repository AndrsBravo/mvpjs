export default class {
  #pathname;
  #search;
  #id;
  #page = null;
  #pageName;
  #pageMethod = "start";
  #params = null;

  constructor({ pathname, search }) {
    this.#pathname = pathname;
    this.#search = search;
    this.#routeId({ pathname, search });
  }

  getRouteId() {
    return this.#id;
  }
  async getPage() {
    if (!this.#page) {
      const { default: page } = await Import(this.#pageName);
      this.#page = page;
      this.#page = new this.#page();
    }

    this.#page.setPageName(this.#id);
    console.log("Page mothod " + this.#pageMethod);
    this.#page[this.#pageMethod](this.#params);
    return this.#page;
  }
  setPage(page) {
    this.#page = page;
    this.#page.setPageName(this.#id);
  }
  getParams() {
    return this.#params;
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

  #routeId({ pathname, search }) {
    this.#setParams(search);

    const route = [pathname, search];
    this.#pageName = "home";

    let id = route.reduce((acum, value) => {
      acum = acum + value.trim().replace(" ", "_");
      return acum;
    }, "");

    id = [...id]
      .reduce((acum, item) => acum + 32 * item.charCodeAt(0), 1)
      .toString(36);

    if (pathname === "/") {
      this.#id = this.#pageName + "_" + id;
      console.log(this.#id);
      return;
    }

    const values = pathname.split("/");
    values.shift();

    if (values.length > 0) {
      this.#pageName = values.shift();
    }
    if (values.length > 0) {
      this.#pageMethod = values.shift();
    }

    this.#id = this.#pageName + "_" + id;
  }
}
