export default class {

    #name;
    #title;
    #entity;
    #data;
    #dataEventListeners = [];

    constructor(name, title, entity) {

        this.#name = name;
        this.#title = title;
        this.#entity = entity;

    }

    getName() { return this.#name; }
    getEntity() { return this.#entity; }
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
    addData(item) {

        if (!this.#data) { this.#data = []; }

        this.#data.push(item);
        this.#callListeners([item]);
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