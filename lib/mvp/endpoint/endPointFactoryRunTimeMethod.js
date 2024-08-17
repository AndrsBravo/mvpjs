import System from "../../core/system/System";

function prepareEndPointData(data) {


    if (this.requestInit.headers && this.requestInit.headers["Content-Type"] && this.requestInit.headers["Content-Type"].startsWith("application/json")) {

        this.requestInit["body"] = JSON.stringify(data);
        return;
    }

    this.requestInit["body"] = data;


}

function defineEnPointParams(data) {

    const regEx = /{([^}]+)}/g

    if (!this.baseURL.match(regEx)) return;

    let url = this.baseURL;
    const paramsProvided = Object.keys(data).length;
    const paramsExpected = url.match(regEx).length;

    if (paramsProvided < paramsExpected) {
        throw Error(`Path param missed '${url}' ${paramsExpected} 'expected' and ${paramsProvided} 'provided' ${JSON.stringify(data)}`)
    }

    url = Function("data", `return \` ${url}\``)(data);

    this.fetchUrl = url;


}

function defineEndPointRequest() {

    const request = new Request(this.fetchUrl || this.baseURL, this.requestInit);
    this.request = request;


}

async function fetchEndPoint() {

    let res = await fetch(this.request);

    this.response = res;
    System.endPointResponse(this.response);

    const resType = this.response.headers.get('Content-Type');

    if (!resType) return {}

    if (resType.indexOf('application/json') > -1) return await res.json() || {};
    if (resType.indexOf('text/plain') > -1) { const text = await res.text() || ""; return { text } };

}

export { defineEnPointParams, prepareEndPointData, defineEndPointRequest, fetchEndPoint }