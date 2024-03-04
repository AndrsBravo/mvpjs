import System from "lib/core/system/System.js";

class Application {

  #config;

  constructor() {
    this.#init();
  }

  #init() {

    console.log("En el Init del apllication");
    const HTMLPageLoad = async (evt) => {

      const { default: configObject } = await import("/node_modules/.mvpjs/mvp.config.js");

      const { default: route } = await import("/node_modules/.mvpjs/mvp.routes.js");

      console.log("El config object", configObject);

      this.#config = configObject;

      //   const { default: layout } = await this.#config.theme.layout();
      const { default: layout } = await route.layout();

      System.config = this.#config;

      await System.layout({ layout });
      System.load(evt);

    }

    window.addEventListener("DOMContentLoaded", HTMLPageLoad);

    window.onpopstate = async (evt) => System.popstate(evt);

  }
}

const application = new Application();
export { application };