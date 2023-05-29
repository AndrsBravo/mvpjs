import System from "../../core/system/System";

export class EndPointCollection {

  #name;
  #endPointsConfig;
  #data = [];
  #endpoints = {};
  #changeListeners = new Map();
  static models;

  /** */
  constructor(name, config) {
    this.#name = name;
    this.#endPointsConfig = config;
    this.#init();
    this.#config();
  }

  endPoints() { }
  addDataChangeEventListener(endPointFnName, eventListener, model) {

    if (this.#changeListeners.has(endPointFnName)) {
      this.#changeListeners.get(endPointFnName).push([eventListener, model]);
      return
    }

    this.#changeListeners.set(endPointFnName, [[eventListener, model]]);

  }

  get endpoints() {
    return this.#endPointsConfig.endpoints;
  }

  #init() {

    if (!this.#endPointsConfig.endpoints) this.#endPointsConfig["endpoints"] = {};
    if (this.endPoints) this.#endPointsConfig.endpoints = { ...this.#endPointsConfig.endpoints, ...this.endPoints() };

  }
  get name() { return this.#name; }

  #config() {

    let url = null;
    if (this.#endPointsConfig.baseURL) url = new URL(this.#endPointsConfig.baseURL);

    for (const endpoint in this.#endPointsConfig.endpoints) {

      if (url) this.#endPointsConfig.endpoints[endpoint]["baseURL"] = url;

      this.#endPointsConfig.endpoints[endpoint]["fnName"] = endpoint;

      this.#endpoints[endpoint] = new EndPoint(this.#endPointsConfig.endpoints[endpoint]);

      if (this.#endpoints[endpoint].requestInit.method == "PUT") {

        this.#endPointsConfig.endpoints[endpoint]["fn"] = async (params, data) => {

          // console.log(this.#endpoints[endpoint].requestInit.method.toUpperCase() + ":" + this.#endpoints[endpoint].fetchUrl);

          console.log("Los params================");
          console.log(params);
          console.log("La Data ================");
          console.log(data);

          // this.#endpoints[endpoint].param = data;
          console.log(this.#endpoints[endpoint].requestInit.method.toUpperCase() + ":" + this.#endpoints[endpoint].fetchUrl);
          const resData = await this.#endpoints[endpoint].fetch(params, data);
          console.log("La data returned by PUT");
          console.log(resData);
          return this.#endpoints[endpoint].response;
        };
        continue;

      }
      if (this.#endpoints[endpoint].params) {

        this.#endPointsConfig.endpoints[endpoint]["fn"] = async (data) => {

          // console.log(this.#endpoints[endpoint].requestInit.method.toUpperCase() + ":" + this.#endpoints[endpoint].fetchUrl);

          console.log("Los params================");
          console.log(data);

          // this.#endpoints[endpoint].param = data;
          console.log(this.#endpoints[endpoint].requestInit.method.toUpperCase() + ":" + this.#endpoints[endpoint].fetchUrl);
          const resData = await this.#endpoints[endpoint].fetch(data);
          this.addData(endpoint, resData);
          return this.#endpoints[endpoint].response;
        };
        continue;

      }

      this.#endPointsConfig.endpoints[endpoint]["fn"] = async () => {

        const resData = await this.#endpoints[endpoint].fetch();
        this.addData(endpoint, resData);
        return this.#endpoints[endpoint].response;
      };

    }
  }

  addData(endpoint, data) {

    const listeners = this.#changeListeners.get(endpoint);

    listeners.forEach(listenerModel => {

      const [listener, model] = listenerModel;

      listener.apply(model, [data]);

    });

    if (data instanceof Array) {
      this.#data = [...this.#data, ...data];
      return;
    }

    this.#data.push(data);
  }

}

const fetchStrategy = {

  async template() {
    console.log(this.requestInit.method.toUpperCase() + ":" + this.fetchUrl);
    console.log(this.requestInit);
    try {
      const res = await fetch(this.fetchUrl, this.requestInit);
      this.response = { bodyUsed: res.bodyUsed, headers: res.headers, ok: res.ok, status: res.status, statusText: res.statusText, type: res.type, url: res.url };
      System.endPointResponse(this.response);
      return await res.json();
    } catch (e) {
      // this.response = { bodyUsed: res.bodyUsed, headers: res.headers, ok: res.ok, status: res.status, statusText: res.statusText, type: res.type, url: res.url };

    }
    return [];

  },

  get(endPointObject) {
    return async () => { return await this.template.apply(endPointObject) };
  },

  getparam(endPointObject) {
    return async (param) => { endPointObject.params = param; return await this.template.apply(endPointObject) };
  },

  post(endPointObject) {
    return async (data) => { endPointObject.dataPrepare(data); return await this.template.apply(endPointObject) };
  },

  put(endPointObject) {
    return async (param, data) => { endPointObject.params = param; endPointObject.dataPrepare(data); return await this.template.apply(endPointObject) };
  },

  delete(endPointObject) {
    return async (param) => { endPointObject.params = param; return await this.template.apply(endPointObject) };
  }

}

class EndPoint {
  #endpointObj;
  #fetchUrl;
  #requestInit;
  #method = "GET";
  #response;
  #params;
  #fetchFunctionName;

  constructor(endpoint) {
    this.#endpointObj = endpoint;
    this.#init();
    this.#setFetchFunction();
  }

  get response() { return this.#response; }
  set response(res) { this.#response = res; }
  get fetchUrl() { return this.#fetchUrl; }
  get requestInit() { return this.#requestInit; }
  set params(params) { this.#urlParams(params); }
  get params() { return this.#params; }

  #init() {

    if (!this.#endpointObj.requestInit) this.#requestInit = { method: this.#method };
    if (this.#endpointObj.requestInit) this.#requestInit = this.#endpointObj.requestInit;
    if (this.#endpointObj.requestInit.build) this.#requestInit = this.#endpointObj.requestInit.build;

    this.#endpointObj.url = this.#endpointObj.url.replaceAll("{", "${").replaceAll("@", "data.");

    if (this.#requestInit.method == "POST") { this.#params = ["POST"]; this.#endpointObj.param = this.#params; this.#fetchFunctionName = "post"; this.#fetchUrl = this.#endpointObj.url;; this.#setFetchUrl(); return; }
    if (this.#requestInit.method == "PUT") { this.#params = ["PUT"]; this.#endpointObj.param = this.#params; this.#fetchFunctionName = "put"; this.#fetchUrl = this.#endpointObj.url;; this.#setFetchUrl(); return; }

    this.#params = this.#endpointObj.url.match(/{([^}]+)}/g);

    this.#endpointObj.param = this.#params;

    this.#fetchFunctionName = this.#requestInit.method.toLowerCase();

    if (!this.#params) { this.#fetchUrl = this.#endpointObj.url; this.#setFetchUrl(); return; }

    this.#fetchFunctionName = this.#fetchFunctionName + "param";

  }

  #setFetchFunction() {

    if (!(this.#fetchFunctionName in fetchStrategy)) return;
    this.fetch = fetchStrategy[this.#fetchFunctionName](this);

  }

  #setFetchUrl() {
    if (this.#endpointObj.baseURL) this.#fetchUrl = this.#endpointObj.baseURL.href + this.#fetchUrl;
  }

  async fetch() { }

  dataPrepare(data) {

    console.log(data);

    //console.log(this.#requestInit.headers["Content-Type"]) ;
    if (this.#requestInit.headers && this.#requestInit.headers["Content-Type"] && this.#requestInit.headers["Content-Type"].startsWith("application/json")) {

      this.#requestInit["body"] = JSON.stringify(data);
      return;
    }

    this.#requestInit["body"] = data;

    console.log(this.#requestInit);

  }

  #urlParams(data) {

    if (this.#endpointObj.url.match(/{([^}]+)}/).length < 0) return;

    let url = this.#endpointObj.url;

    console.log(data);
    const paramsProvided = Object.keys(data).length;
    const paramsExpected = url.match(/{([^}]+)}/g).length;

    if (paramsProvided < paramsExpected) {
      throw Error(`Path param missed '${url}' ${paramsExpected} expected, only ${paramsProvided} provided ${JSON.stringify(data)}`)
    }

    /* while (url.match(/{([^}]+)}/g)) {
       const [property, value] = /{([^}]+)}/.exec(url);
       url = url.replaceAll(property, data[value]);
     }*/

    url = eval("`" + url + "`");

    if (this.#endpointObj.baseURL) this.#fetchUrl = this.#endpointObj.baseURL.href + url;

  }
}

class MemoryData {

  static #data = new Map();

  static #actionfn(object) {
    return (item) => {
      const has = [];
      Object.keys(object).forEach(key => has.push(object[key] === item[key]));
      return has.every(value => value === true);
    }
  }

  static find(dataKey, object) {

    if (!this.#data.has(dataKey)) return;
    const data = this.#data.get(dataKey);
    return data.find(this.#actionfn(object));
  }

  static findAll(dataKey, object) {

    if (!this.#data.has(dataKey)) return;
    const data = this.#data.get(dataKey);
    return data.filter(this.#actionfn(object));
  }

  static get(dataKey) { return this.#data.get(dataKey); }
  static add(dataKey, data) {
    if (!this.#data.has(dataKey)) { this.#data.set(dataKey, data); return; }
    this.#data.set(dataKey, [...this.#data.get(dataKey), ...data]);
  }
  static remove(dataKey) { this.#data.delete(dataKey) }
  static set(dataKey, data) { this.#data.set(dataKey, data); }

}