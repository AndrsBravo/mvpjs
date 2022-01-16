import Route from "./Route";
import setUpSystemComponent from "./setUpSystemComponent";

export default class {
  static #layout;
  static _routes = new Map();
  /**
   *
   * @param {Layout} layout
   */
  static layout({ layout, start }) {
    this.#layout = layout;

    if (!start) {
      this.#layout.start();
      return;
    }

    if (window.location.pathname === "/") {
      const route = new Route(window.location);
      route.setPresenter(start);
      this._routes.set(route.getRouteId(), route);
      this.routes(window.location);
    }
  }

  static routes(url) {
    const route = new Route(url);
    console.log("Esta ruta");
    if (!this._routes.has(route.getRouteId())) {
      this._routes.set(route.getRouteId(), route);
    }
  }

  static route({ route, presenter, presenterName }) {
    const formView = new presenter();
    const formName = this.#presenterName({ route, presenterName });
    formView.setFormName(formName);
    formView.setLayout(this.#layout);
    formView[route.method](route.params);
  }

  static #presenterName({ route, presenterName }) {
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

  static async load() {
    await setUpSystemComponent(document.body);
  }

  static async formview(htmlElement) {
    let { DefaultModalForm } = await Import("DefaultModalForm");

    this.#renderForm(new DefaultModalForm());
  }

  static #renderForm(formView) {
    formView.getViews().forEach((view) => {
      const html = view.getTemplate().getHTML();
      if (view.getTarget() instanceof HTMLElement) {
        view.getTarget().appendChild(html);
      }
    });
  }
}
