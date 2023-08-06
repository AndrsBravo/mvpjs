import System from "../../core/system/System";

const fetchStrategy = {

    async template() {
      console.log(this.requestInit.method.toUpperCase() + ":" + this.fetchUrl);
      console.log(this.requestInit);
      try {
        const res = await fetch(this.fetchUrl, this.requestInit);
        this.response = res;
       // this.response = { bodyUsed: res.bodyUsed, headers: res.headers, ok: res.ok, status: res.status, statusText: res.statusText, type: res.type, url: res.url };
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
  
  export default class EndPoint {
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
  
      if (this.#requestInit.method == "POST") { this.#params = ["POST"]; this.#endpointObj.param = this.#params; this.#fetchFunctionName = "post"; this.#fetchUrl = this.#endpointObj.url; this.#setFetchUrl(); return; }
      if (this.#requestInit.method == "PUT") { this.#params = ["PUT"]; this.#endpointObj.param = this.#params; this.#fetchFunctionName = "put"; this.#fetchUrl = this.#endpointObj.url; this.#setFetchUrl(); return; }
  
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
     // if (this.#endpointObj.baseURL) this.#fetchUrl = this.#endpointObj.baseURL.href + this.#fetchUrl;
      if (this.#endpointObj.baseURL) this.#fetchUrl = this.#endpointObj.baseURL + this.#fetchUrl;
    }
  
    async fetch() { }
  
    dataPrepare(data) {
  
      console.log(data);
  
     // if (this.#requestInit.headers && this.#requestInit.headers["Content-Type"] && this.#requestInit.headers["Content-Type"].startsWith("application/json")) {
      if (this.#requestInit?.headers["Content-Type"]?.startsWith("application/json")) {
  
        this.#requestInit["body"] = JSON.stringify(data);
        return;
      }
  
      this.#requestInit["body"] = data;
  
      console.log(this.#requestInit);
  
    }
  
    #urlParams(data) {
  
      if (!this.#endpointObj.url.match(/{([^}]+)}/)) return;
  
      let url = this.#endpointObj.url;
      const paramsProvided = Object.keys(data).length;
      const paramsExpected = url.match(/{([^}]+)}/g).length;
  
      if (paramsProvided < paramsExpected) {
        throw Error(`Path param missed '${url}' ${paramsExpected} 'expected' and ${paramsProvided} 'provided' ${JSON.stringify(data)}`)
      }    
  
      url = eval("`" + url + "`");
  
     // if (this.#endpointObj.baseURL) this.#fetchUrl = this.#endpointObj.baseURL.href + url;
      if (this.#endpointObj.baseURL) this.#fetchUrl = this.#endpointObj.baseURL + url;
  
    }
  }