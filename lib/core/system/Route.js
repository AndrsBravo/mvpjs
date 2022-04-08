export default class {
  #pathname;
  #search;
  #id;
  #page = null;
  #pageName ;
  #pageMethod = "start";
  #params = null;

  constructor({ pathname, search }) {
    console.log("-------------------");
    console.log(pathname, search);
    this.#pathname = pathname;
    this.#search = search;
    this.#routeId({ pathname, search });
  }

  getRouteId() {
    return this.#id;
  }
  async getPage() {
    console.log("Loasd page----");
    if (this.#pathname === "/") {
      const { default: page } = await Import(this.#pageName);

      console.log("------el page si es home");
      console.log(this.#pageName);
      console.log(page);

      if (!page) {
        this.#pageName = "startpage";
        const { default: page } = await Import(this.#pageName);
        this.#page = new page();
        return;
      }

      this.#page = new page();
      return;
    }

    const { default: page } = await Import(this.#pageName);
    this.#page = new page();
  }

  async render(layout) {
    await this.getPage();
    console.log(this.#page);
    this.#page.setName(this.#id);
    this.#page.setLayout(layout);
    console.log("Page mothod " + this.#pageMethod);
    this.#page[this.#pageMethod](this.#params);
  }
  setPage(page) {
    this.#page = page;
    this.#page.setName(this.#id);
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

  async #routeId({ pathname, search }) {
    this.#setParams(search);

    const route = [pathname, search];
    this.#pageName = "start";

    let id = route.reduce((acum, value) => {
      acum = acum + value.trim().replace(" ", "_");
      return acum;
    }, "");

    id = [...id]
      .reduce((acum, item) => acum + 32 * item.charCodeAt(0), 1)
      .toString(36);

    if (pathname === "/") {
      this.#id = this.#pageName + "_" + id;
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
