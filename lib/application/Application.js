import System from "lib/core/system/System.js";
import routePathArray from "lib/core/system/routeArray.js";

class Application {
  constructor() {
    this.#init();
  }

  #init() {

    //console.log("En el Init del application");
    const HTMLPageLoad = async (evt) => {

      const { origin } = new URL(import.meta.url)
      //   console.log(new URL(import.meta.url));

      //const { default: configObject } = await import(/* @vite-ignore */ origin + "/node_modules/.mvpjs/mvp.config.js");
      const { default: route } = await import(/* @vite-ignore */ origin + "/node_modules/.mvpjs/mvp.client.config.js");

      const configObject = {};
      configObject.routes = route;

      //console.log(route);

      const requestRouteArray = routePathArray(location)

      if (!route[requestRouteArray[0]]) return;

      System.config = configObject;

      System.load(evt);

    }

    window.addEventListener("DOMContentLoaded", HTMLPageLoad);

    window.onpopstate = async (evt) => System.popstate(evt);

  }
}

const application = new Application();
export { application };