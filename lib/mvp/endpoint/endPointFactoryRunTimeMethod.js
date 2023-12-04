import System from "../../core/system/System";

function prepareEndPointData(data) {

    console.log(data);

    if (this.requestInit.headers && this.requestInit.headers["Content-Type"] && this.requestInit.headers["Content-Type"].startsWith("application/json")) {
        //if (this.requestInit?.headers?["Content-Type"]?.startsWith("application/json")) {

        this.requestInit["body"] = JSON.stringify(data);
        return;
    }

    this.requestInit["body"] = data;

    console.log(this.requestInit);

}

function defineEnPointParams(data) {

    if (!this.baseURL.match(/{([^}]+)}/)) return;

    let url = this.baseURL;
    const paramsProvided = Object.keys(data).length;
    const paramsExpected = url.match(/{([^}]+)}/g).length;

    if (paramsProvided < paramsExpected) {
        throw Error(`Path param missed '${url}' ${paramsExpected} 'expected' and ${paramsProvided} 'provided' ${JSON.stringify(data)}`)
    }

    url = eval("`" + url + "`");
    // if (this.#endpointObj.baseURL) this.#fetchUrl = this.#endpointObj.baseURL.href + url;
    this.fetchUrl = url;

   // Object.defineProperty(this, "fetchUrl", { value: url, writable: false });

}

function defineEndPointRequest() {

    const request = new Request(this.fetchUrl || this.baseURL, this.requestInit);
    this.request = request;
    
 //   Object.defineProperty(this, "request", { value: request, writable: false });

}

async function fetchEndPoint() {

    console.log(this.request.url);
    console.log(this);
    console.log(this.requestInit.method.toUpperCase() + ":" + (this.fetchUrl || this.baseURL));
    console.log(this.request);

    const res = await fetch(this.request);
    this.response = res;
    // this.response = { bodyUsed: res.bodyUsed, headers: res.headers, ok: res.ok, status: res.status, statusText: res.statusText, type: res.type, url: res.url };
    System.endPointResponse(this.response);

    if (!this.response.ok) return null;

    return await res.json();

}

export { defineEnPointParams, prepareEndPointData, defineEndPointRequest, fetchEndPoint }