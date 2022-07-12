export  class Model {

    #name;
    #title;
    endpoint;
    #data;
    #dataEventListeners = [];

    constructor(name, title, endpoint) {

        this.#name = name;
        this.#title = title;
        this.endpoint = endpoint;

    }

    getName() { return this.#name; }
    getEntity() { return this.endpoint; }
    getTitle() { return this.#title; }
    setData(data) {
        this.#data = data;
        this.#callListeners(data);
    }

    getData() {
        return this.#data;
    }

    /**
     * 
     * @param {string} field 
     * @param {*} param 
     * @returns []
     */
    getBy(field, param) {

        return this.#data.filter(item => item[field] === param);

    }

    /**
     * 
     * @param {Object} item 
     */
    async addData(item) {

        this.#data = item;
        this.#callListeners(item);
    }

    refresh(item) {

        this.#callListeners([item]);
    }

    /**
     * 
     * @param {Function} callback 
     */
    addDataEventListener(callback) {

        this.#dataEventListeners.push(callback);
        if (this.#data) {
            callback(this.#data);
        }
    }

    #callListeners(data) {

        if (this.#dataEventListeners.length < 1) {
            return;
        }

        this.#dataEventListeners.forEach((listener) => {
            listener(data);
        })

    }

}