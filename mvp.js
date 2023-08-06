export * from "./lib/builder/HtmlTemplateBuilder";

export const { requestInit } = await import("./lib/mvp/endpoint/requestInit");
export const { EndPointCollection } = await import("./lib/mvp/endpoint/EndPointCollection");
export const { Presenter } = await import("./lib/mvp/presenters/Presenter");
export const { Layout } = await import("./lib/mvp/layout/Layout");
export const { Model } = await import("./lib/mvp/model/Model");
export const { View } = await import("./lib/mvp/view/View");
export const { Template } = await import("./lib/mvp/view/Template");
export const { Page } = await import("./lib/mvp/page/Page");