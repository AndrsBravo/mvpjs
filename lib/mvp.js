import App from "./application/App";
import Entity from "./mvp/entity/Entity";
import Layout from "./mvp/layout/Layout";
import Model from "./mvp/model/Model";
import View from "./mvp/view/View";
import html from "./builder/HtmlTemplateBuilder";
import Template from "./mvp/view/Template";
import Page from "./mvp/page/Page";
//import FormView from "./mvp/form/FormStart";
import Presenter from "./mvp/presenters/Presenter";

export default function (config) {
  new App(config);
}

export { Entity };
export { Presenter };
export { Layout };
export { Model };
export { View };
export { Template };
export { html };
export { Page  };
//export { FormView };
