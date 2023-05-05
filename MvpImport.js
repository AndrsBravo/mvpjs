class MvpImport {
  constructor() {}
  get HtmlTemplateBuilder() {
    return import("./lib/builder/HtmlTemplateBuilder.js");
  }
  get Configuration() {
    return import("./lib/config/Configuration.js");
  }
  get appActions() {
    return import("./lib/core/application-set-up/appActions.js");
  }
  get ActivityDataMutationObserver() {
    return import("./lib/core/system/ActivityDataMutationObserver.js");
  }
  get binding() {
    return import("./lib/core/system/binding/binding.js");
  }
  get appendChild() {
    return import("./lib/core/system/event-handlers/appendChild.js");
  }
  get dropzone() {
    return import("./lib/core/system/event-handlers/dropzone.js");
  }
  get event() {
    return import("./lib/core/system/event-handlers/event.js");
  }
  get resize() {
    return import("./lib/core/system/event-handlers/resize.js");
  }
  get submit() {
    return import("./lib/core/system/event-handlers/submit.js");
  }
  get getContext() {
    return import("./lib/core/system/getContext.js");
  }
  get Route() {
    return import("./lib/core/system/router/Route.js");
  }
  get routeId() {
    return import("./lib/core/system/router/routeId.js");
  }
  get RouteService() {
    return import("./lib/core/system/router/RouteService.js");
  }
  get setUpSystemComponent() {
    return import("./lib/core/system/setUpSystemComponent.js");
  }
  get System() {
    return import("./lib/core/system/System.js");
  }
  get FileManager() {
    return import("./lib/core/utils/FileManager.js");
  }
  get systemTemplate() {
    return import("./lib/core/utils/systemTemplate.js");
  }
  get UUID() {
    return import("./lib/core/utils/UUID.js");
  }
  get EndPointCollection() {
    return import("./lib/mvp/endpoint/EndPointCollection.js");
  }
  get Layout() {
    return import("./lib/mvp/layout/Layout.js");
  }
  get Model() {
    return import("./lib/mvp/model/Model.js");
  }
  get Page() {
    return import("./lib/mvp/page/Page.js");
  }
  get Presenter() {
    return import("./lib/mvp/presenters/Presenter.js");
  }
  get dataRender() {
    return import("./lib/mvp/view/render/dataRender.js");
  }
  get generateView() {
    return import("./lib/mvp/view/render/generateView.js");
  }
  get renderNode() {
    return import("./lib/mvp/view/render/renderNode.js");
  }
  get renderSys() {
    return import("./lib/mvp/view/render/renderSys.js");
  }
  get renderView() {
    return import("./lib/mvp/view/render/renderView.js");
  }
  get secoundRender() {
    return import("./lib/mvp/view/render/secoundRender.js");
  }
  get startRender() {
    return import("./lib/mvp/view/render/startRender.js");
  }
  get viewUtility() {
    return import("./lib/mvp/view/render/viewUtility.js");
  }
  get renderNode() {
    return import("./lib/mvp/view/renderNode.js");
  }
  get setView() {
    return import("./lib/mvp/view/setView.js");
  }
  get Template() {
    return import("./lib/mvp/view/Template.js");
  }
  get View() {
    return import("./lib/mvp/view/View.js");
  }
}
export { MvpImport as default };
