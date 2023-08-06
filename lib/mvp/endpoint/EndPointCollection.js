import EndPoint from "./EndPoint";

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

   /** 
     * @returns {Object.<string,{url:string,requestInit:requestInit}>}
     */
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
    console.log("La ruta a crear", this.#endPointsConfig.baseURL);
    //if (this.#endPointsConfig.baseURL) url = new URL(this.#endPointsConfig.baseURL);
    if (this.#endPointsConfig.baseURL) url = this.#endPointsConfig.baseURL;

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

