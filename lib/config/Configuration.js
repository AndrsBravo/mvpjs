//import configObject from "C:/Users/Bravo/Documents/B.IT/CreActivo/Formacion/Formacion-JS/node/lab-service-front/mvp.config.js";
export default class {
  #routes = {};
  #layout;
  #configObject;
  static instance;
  constructor() {
    console.log("Abriendo la configuracion");
    // if (Configuration.instance) return Configuration.instance;
    // this.#init();
    //  Configuration.instance = this;
  }

  async init() {

    const { default: configObject } = await import("/mvp.config.js");

    this.#configObject = configObject;

    console.log("El configObject");
    console.log(this.#configObject);

    if (!this.#configObject) return;

    this.#configObject.routes.forEach((route) => {

      const key = Object.keys(route)[0];

      this.#routes[`'${key}'`] = route[key];

    });

  }

  get routes() {
    return this.#routes;
  }

  get layout() {

    return this.#configObject.theme.layout();

  }

}
