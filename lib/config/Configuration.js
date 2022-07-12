import configObject from "../application/App.config";
export default class {
  #routes = {};
  #layout;
  static instance;
  constructor() {
   // if (Configuration.instance) return Configuration.instance;
    this.#init();
   //  Configuration.instance = this;
  }

  async  #init() {

    if (!configObject) return;

    configObject.routes.forEach((route) => {

      const key = Object.keys(route)[0];

      this.#routes[`'${key}'`] = route[key];

    });

  }

  get routes() {
    return this.#routes;
  }

  get layout() {
  
    return configObject.theme.layout();

  }

}
