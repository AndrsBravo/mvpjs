export default class {
  #pathname;
  #search;
  #id;
  #presenter = null;
  #presenterName;
  #presenterMethod = "start";
  #params = null;

  constructor({ pathname, search }) {
    this.#pathname = pathname;
    this.#search = search;
    this.#routeId({ pathname, search });
  }

  getRouteId() {
    return this.#id;
  }
  async getPresenter() {
    if (!this.#presenter) {
      const { default: presenter } = await Import(this.#presenterName);
      this.#presenter = presenter;
      this.#presenter = new this.#presenter();
      this.#presenter.setFormName(this.#id);
      this.#presenter[this.#presenterMethod](this.#params);
    }
    return this.#presenter;
  }
  setPresenter(presenter) {
    this.#presenter = presenter;
    this.#presenter.setFormName(this.#id);
  }
  getParams() {
    return this.#params;
  }
  setLayout(layout) {
    this.#presenter.setLayout(layout);
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
    this.#presenterName = "home";

    let id = route.reduce((acum, value) => {
      acum = acum + value.trim().replace(" ", "_");
      return acum;
    }, "");

    id = [...id]
      .reduce((acum, item) => acum + 32 * item.charCodeAt(0), 1)
      .toString(36);

    if (pathname === "/") {
      this.#id = this.#presenterName + "_" + id;
      console.log(this.#id);
      return;
    }

    const values = pathname.split("/");
    values.shift();

    if (values.length > 0) {
      this.#presenterName = values.shift();
    }
    if (values.length > 0) {
      this.#presenterMethod = values.shift();
    }

    this.#id = this.#presenterName + "_" + id;
  }
}
