export default class {
  _pathname;
  _search;
  _id;
  _presenter;
  constructor({ pathname, search }) {
    this._pathname = pathname;
    this._search = search;
    this.#routeId({ pathname, search });
  }

  #routeId({ pathname, search }) {
    const route = [pathname, search];
    const presenterName = "start";

    let id = route.reduce((acum, value) => {
      acum = acum + value.trim().replace(" ", "_");
      return acum;
    }, "");

    const reduce = (acum, item) => {
      return 32 * (acum + item.charCodeAt(0));
    };

    id = [...id]
      .reduce((acum, item) => 32 * (acum + item.charCodeAt(0)), 1)
      .toString(36);

    if (pathname === "/") {
      this._id = presenterName + "_" + id;
      console.log(this._id);
      return;
    }

    const values = "/todo/casa".split("/");
    values.shift();
    console.log(values);

    console.log("El id");
    console.log([...id]);
    const path = presenterName + "_" + [...id].reduce(reduce, 1).toString(36);
    console.log(path);

    this._id = id;
  }
  getRouteId() {
    return this._id;
  }
  getPresenter() {
    return this._presenter;
  }
  setPresenter(presenter) {
    this._presenter = presenter;
  }

  #geneattingId({ route, presenterName }) {
    let subfix = "";

    const reduce = (acum, item) => {
      return (acum = 32 * acum + item.charCodeAt(0));
    };

    if (route.params && route.params instanceof Array) {
      const params = route.params.reduce(
        (acum, item) => [...acum, ...item],
        []
      );

      subfix = "_" + params.reduce(reduce).toString(36);
    }

    if (route.params && route.params instanceof Object) {
      let paraHash = [];

      for (const key in route.params) {
        if (Object.hasOwnProperty.call(route.params, key)) {
          paraHash = [...paraHash, ...route.params[key]];
        }
      }

      subfix = "_" + paraHash.reduce(reduce).toString(36);
    }

    return presenterName + subfix;
  }
}
