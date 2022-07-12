export { default } from "./lib/application/Application";
//export {algo}  from "./lib/application/App";

/*export * from "./lib/mvp/layout/Layout";
export * from "./lib/mvp/model/Model";
export * from "./lib/mvp/view/View";
export * from "./lib/mvp/view/Template";
export * from "./lib/mvp/page/Page";
export * from "./lib/mvp/presenters/Presenter";

*/

export * from "./lib/builder/HtmlTemplateBuilder";



export const { Entity } = await import("./lib/mvp/entity/Entity");
export const {Layout} = await import( "./lib/mvp/layout/Layout");
export const {Model} = await import( "./lib/mvp/model/Model");
export const {View} = await import( "./lib/mvp/view/View");
export const {Template} = await import( "./lib/mvp/view/Template");
export const {Page} = await import( "./lib/mvp/page/Page");
export const {Presenter} = await import( "./lib/mvp/presenters/Presenter");
//export const HtmlBuilder  = await import("./lib/builder/HtmlTemplateBuilder");
export const {app}  = await import("./lib/application/App");
