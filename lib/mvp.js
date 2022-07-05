//export * from "./application/App";
/*export * from "./mvp/entity/Entity";
export * from "./mvp/layout/Layout";
export * from "./mvp/model/Model";
export * from "./mvp/view/View";
export * from "./mvp/view/Template";
export * from "./mvp/page/Page";
export * from "./mvp/presenters/Presenter";
export * from "./core/utils/FileManager";
export * from "./builder/HtmlTemplateBuilder";*/

export function App(){

    return import("./application/App");

}
