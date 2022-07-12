
import MvpImport from "../../MvpImport";
//import Configuration from "../config/Configuration"
class Application {

  #started = false;
  #import = null;
  #config ;
  static #instance;

  constructor() {
    if (Application.#instance) return Application.#instance;
    console.log("Application initialize");
    this.#init();    
    if (!Application.#instance) Application.#instance = this;
  }

  get import() {
    if (!this.#import) this.#import = new MvpImport();
    return this.#import;
  }

  #init() {

    console.log("El init");

    const HTMLPageLoad = async (evt) => {

      console.log("El load");

     const { default: Config } = await this.import.Configuration;

      this.#config = new Config();

      console.log(this.import.System);
      const { default: System } = await this.import.System;
      console.log("El System", System);
      const { default: layout } = await this.#config.layout;

     
      console.log("El layout", layout);

      System.layout({ layout: new layout() });
      System.load(evt);

    }

    window.addEventListener("load", HTMLPageLoad);

    window.onpopstate = async (evt) => {

      const System = this.import.System
      System.popstate(evt);

    };

  }
}

const application = new Application();
export default application;
