import App from "./application/App";
import Layout1 from "./mvp/layout/Layout";
import Model1 from "./mvp/model/Model";
import View1 from "./mvp/view/View";
import htmlbuilder from "./builder/HtmlTemplateBuilder";
import Template1 from "./mvp/view/Template";
import FormViewBase1 from "./mvp/form-view/FormViewBase";

export default function (config) {
  console.log("Esto me pasa por el function ");
  new App(config);
}

export const Layout = Layout1;
export const Model = Model1;
export const View = View1;
export const Template = Template1;
export const html = htmlbuilder;
export const FormViewBase = FormViewBase1;
