
export class Model {

    #name;
    #title;
    #endPoints;
    #data;
    #endPointsFetchActionsAllowed;
    #dataEventListeners = [];
    #filtered = false;

    /** 
     * @param {Object} param  
     * @param {string} param.name - Model Name to identify a model
     * @param {string} param.title - Model Title
     * @param {EndPointCollection} param.endpoint - EndPoint the model is associated to.  
     * @param {Array} param.endPointsActions - List of EndPointCollection's fetch methods that could perform.   
     */
    constructor({ name, title, endpoint, endPointsFetchActionsAllowed = [] }) {

        this.#name = name;
        this.#title = title;
        this.#endPoints = endpoint;
        this.#endPointsFetchActionsAllowed = endPointsFetchActionsAllowed;
        this.#setFuctions();
        this.#data = new Proxy([], this.#dataProsyHandler(this));
    }

    #setFuctions() {

        for (const endpoint in this.#endPoints.endpoints) {

            function setEndPoint(endpoint) {

                if (endpoint.requestInit.build.method == "PUT") {
                    return async (params, data) => { return await endpoint.fn(params, data) }
                }

                if (endpoint.param) {
                    return async (data) => { return await endpoint.fn(data) }
                }

                return async () => { return await endpoint.fn() }

            }

            if (this.#endPointsFetchActionsAllowed.length < 1) {
                this[endpoint] = setEndPoint(this.#endPoints.endpoints[endpoint]);
                this.#endPoints.addDataChangeEventListener(endpoint, this.#endPointCollectionDataChangeListener, this)
                continue;
            }

            if (this.#endPointsFetchActionsAllowed.includes(endpoint)) {
                this[endpoint] = setEndPoint(this.#endPoints.endpoints[endpoint]);
                this.#endPoints.addDataChangeEventListener(endpoint, this.#endPointCollectionDataChangeListener, this)
                continue;
            }

        }
    }

    #endPointCollectionDataChangeListener(data) {

        this.#data.set(data);
    }
    get name() { return this.#name; }
    get title() { return this.#title; }
    get data() { return this.#data; }

    /** @param {Function} callback */
    addDataEventListener(callback) {
        this.#dataEventListeners.push(callback);
        if (this.#data.length) {
            callback(this.#data);
        }
    }

    async callListeners(data) {

        if (data["filter"]) this.#filtered = true;

        if (this.#dataEventListeners.length < 1) return;
        for (const listener in this.#dataEventListeners) {
            await this.#dataEventListeners[listener](data);
        }

    }

    #dataProsyHandler(model) {

        return {
            get(target, prop, receiver) {

                const extratField = (letra) => letra.charAt(0).toLowerCase() + letra.slice(1);

                if (prop == "last") return () => { return target[target.length - 1]; }
                if (prop == "first") return () => { return target[0]; }
                if (prop == "filter") return (fn) => { const data = target.filter(fn); model.callListeners({ filter: data });  /*/model.callListeners(target)*/ }
                if (prop == "clearFilter") return () => { model.callListeners({ set: target }); }

                if (prop in target) return target[prop];
                if (target.length && Object.hasOwnProperty.call(target[0], prop)) { return target.map(item => { return { [prop]: item[prop] } }); }
                if (prop === "set") return (data) => { target.length = 0; if (data instanceof Array) { Array.prototype.push.apply(target, data); model.callListeners({ set: target }); return; } target.push(data); model.callListeners({ set: target }) }
                if (prop === "add") return (data) => { data instanceof Array ? Array.prototype.push.apply(target, data) : target.push(data); model.callListeners({ add: data }) }
                if (prop === "update") return (data) => { }
                if (prop === "delete") return (data) => { }
                if (prop.startsWith("findBy")) return (data) => { const field = extratField(prop.replace("findBy", "")); return target.find(item => item[field] == data); }
                if (prop.startsWith("filterBy")) return (data) => { const field = extratField(prop.replace("filterBy", "")); receiver.filter(item => item[field] == data); }
                if (prop.startsWith("sortBy")) return () => {
                    const field = extratField(prop.replace("sortBy", ""));
                    return target.sort((item, item2) => item[field] - item2[field]);
                }

                if (prop.startsWith("mapAll")) return (objectProperties) => { return target.map(item => { const algo = {}; for (const key in objectProperties) { algo[key] = item[key]; } return algo; }); }
                if (prop.startsWith("map")) return () => { const field = extratField(prop.replace("map", "")); return target.map(item => { return { [field]: item[field] } }); }


            }
        }

    }

}