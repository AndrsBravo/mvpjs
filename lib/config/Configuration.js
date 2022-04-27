export default class {
  _configResources;
  _routes;
  _layout;
  _startPresenter;

  constructor({ routes, layout, resources }) {
    this._configResources = { ...this.#config, ...resources };
    this._routes = { ...this.#routes, ...routes };
    this.#registerGlobals();
    this._layout = layout;
    this._startPresenter = routes.home;
  }

  getRoutes() {
    return this._routes;
  }

  #registerGlobals() {
    if (typeof window.Import === "undefined")
      window.Import = async (resource) => {
        return await import(this._configResources[resource]);
      };

    if (typeof window.Resource === "undefined")
      window.Resource = (resource) => {
        return resource in _configResources;
      };
    if (typeof window.Routes === "undefined")
      window.Routes = (route) => {
        return this._routes[route];
      };
  }

  #routes = {
    notfoundpage: "notfoundpage",
  };

  #config = {
    //Application
    Application: "/application/Application.js",

    //MVP
    presenter: "../mvp/presenter/presenter.js",
    model: "../mvp/model/model.js",
    view: "../mvp/view/view.js",
    renderPresenter: "../mvp/view/renderPresenter.js",
    template: "../mvp/view/template.js",
    setController: "../mvp/setController.js",
    DefaultModalForm: "../mvp/form-view/DefaultModalForm.js",
    DefaultLayout: "../mvp/layout/base/DefaultLayout.js",
    startpage: "../mvp/page/StartPage.js",
    notfoundpage: "../mvp/page/NotFoundPage.js",

    //Helpers
    htmltemplatebuilder: "/builder/htmltemplatebuilder.js",

    //Core
    //system

    setUpSystemComponent: "/core/system/setUpSystemComponent.js",
    getContext: "/core/system/getContext.js",
    mkAction: "/core/system/mkAction.js",
    ActivityDataMutationObserver:
      "/core/system/ActivityDataMutationObserver.js",
    systemActionListener: "/core/system/systemActionListener.js",

    //system\event-handlers
    appendChild: "/core/system/event-handlers/appendChild.js",
    dropzone: "/core/system/event-handlers/dropzone.js",
    event: "/core/system/event-handlers/event.js",
    resize: "/core/system/event-handlers/resize.js",
    submit: "/core/system/event-handlers/submit.js",
    //Application-set-up
    setUpApplicationComponent:
      "/core/application-set-up/setUpApplicationComponent.js",
    appActions: "/core/application-set-up/appActions.js",

    //utils
    systemTemplate: "/core/utils/systemTemplate.js",
  };
}
