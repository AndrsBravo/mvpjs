import { Model } from "../model/Model";
import { defineEndPointRequestInit, defineEndPointUrl } from "./endPointFactoryMethod";
import { defineModelHttpMethod } from "./modelFactoryMethod";

/**
 * @typedef {Object} EndPointConfiguration Configuration object
 * @property {String} config.name `EndPointCollection` Name
 * @property {String} [config.baseURL] Set a baseURL for all `EndPoint`
 * @property {String} [config.storage = "memory"] Set a baseURL for all `EndPoint`
 * @property {Object.<string,EndPoint>} config.endPoints Describe los endpoints  
 */

/**   
 * @typedef {Object} EndPoint end-point needed to fetch at
 * @property {String} url El URL
 * @property {object} requestInit 
 * El requestInit
 */

/**  This Is a Description of the Class */
export class EndPointCollection {

  /**@type {string} */
  #name = "";
  /**@type {EndPointConfiguration} */
  #config;
  /**@type {Array} */
  #data = [];

  #changeListeners = new Map();

  /** @param {EndPointConfiguration} config */
  constructor(config) {
    this.#name = config.name;
    this.#config = config;
    this.#config.models = {};
    defineEndPointsConfiguration.apply(this.#config, [this]);
  }

  get name() { return this.#name; }

}

/** 
 * @param {EndPointCollection} endPointCollection 
 */
function defineEndPointsConfiguration(endPointCollection) {

  for (const endPointIdentifier in this.endPoints) {

    const endPoint = this.endPoints[endPointIdentifier];

    defineEndPointUrl.apply(endPoint, [this]);
    defineEndPointRequestInit.apply(endPoint);
    endPoint.name = endPointIdentifier;

    const model = new Model(endPointIdentifier);

    this.models[endPointIdentifier] = model;

    defineModelHttpMethod.apply(model, [endPoint]);

    Object.defineProperty(endPointCollection, endPointIdentifier, { value: () => model, writable: false });
  }
}