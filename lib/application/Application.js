import System from "../core/system/System.js";

class Application {

  #config;

  constructor() {
    this.#init();
  }

  #init() {

    const HTMLPageLoad = async (evt) => {

      const { default: configObject } = await import("/mvp.config.js");

      this.#config = configObject;

      const { default: layout } = await this.#config.theme.layout();

      System.config = this.#config;

      await System.layout({ layout });
      System.load(evt);

    }

    window.addEventListener("DOMContentLoaded", HTMLPageLoad);

    window.onpopstate = async (evt) => {

      System.popstate(evt);

    };

  }
}

const application = new Application();
export default application;
