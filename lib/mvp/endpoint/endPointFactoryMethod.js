function defineEndPointUrl(config) {

    const duplicate = /\/\/+/g
    let baseURL = (config.baseURL + this.url).replaceAll(duplicate, "/");
    baseURL = baseURL.replaceAll("{@", "${data.");
    Object.defineProperty(this, "baseURL", { value: baseURL, writable: false });

    let params = baseURL.match(/{([^}]+)}/g);

    Object.defineProperty(this, "params", { value: params || [], writable: false });
}

function defineEndPointRequestInit() {

    let init = { method: "GET" };
    if (this.requestInit) init = this.requestInit;
    if (this.requestInit.build) init = this.requestInit.build;

    Object.defineProperty(this, "requestInit", { value: init, writable: false });

}


export { defineEndPointUrl, defineEndPointRequestInit }