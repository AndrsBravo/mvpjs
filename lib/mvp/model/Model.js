export class Model {

  #name;
  #data;
  #dataEventListeners = [];
  #filtered = false;

  /**
   * 
   * @param {String} name Name of Model. Was given by `EndPoint` definition's, on `EndPointCollection`'s constructor
   * @param {EndPointCollection} endPointCollection 
   */
  constructor(name) {
    this.#name = name;
    this.#data = new Proxy([], this.#dataProxyHandler(this));
  }

  endPointCollectionDataChangeListener(data) {

    this.#data.set(data);
  }

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

  #dataProxyHandler(model) {

    return {
      get(target, prop, receiver) {

        const extractField = (letra) => letra.charAt(0).toLowerCase() + letra.slice(1);


        if (prop == "get") return () => { return target; }
        if (prop == "reload") return () => { model.callListeners({ set: target }); }
        if (prop == "last") return () => { return target[target.length - 1]; }
        if (prop == "first") return () => { return target[0]; }
        if (prop == "filter") return (fn) => { const data = target.filter(fn); model.callListeners({ filter: data });  /*/model.callListeners(target)*/ }
        if (prop == "clearFilter") return () => { model.callListeners({ set: target }); }
        if (prop == "clear") return () => { target = [], model.callListeners({ clear: '' }); }

        if (prop in target) return target[prop];
        if (target.length && Object.hasOwnProperty.call(target[0], prop)) { return target.map(item => { return { [prop]: item[prop] } }); }
        if (prop === "set") return async (data) => { target.length = 0; if (data instanceof Array) { Array.prototype.push.apply(target, data); return await model.callListeners({ set: target }); } target.push(data); return await model.callListeners({ set: target }) }

        if (prop === "add") return (data) => { data instanceof Array ? Array.prototype.push.apply(target, data) : target.push(data); model.callListeners({ add: data }) }
        if (prop === "update") return (data) => { }
        if (prop === "delete") return (data) => {

          const getIndex = (data) => {

            const index = target.findIndex((value) => {

              for (const key in data) {
                if (!Object.hasOwnProperty.call(data, key)) continue;
                if (!value[key] || data[key] != value[key]) return false;
              }

              return true


            });
            return index
          }

          const removeObject = (obj) => {
            const index = getIndex(obj)

            if (index > -1) {
              model.callListeners({ delete: target.splice(index, 1) });
              return true
            }
          }

          if (!data) return false
          if (data instanceof Array || data instanceof Set) {

            data.forEach(item => removeObject(item))

          }
          if (typeof (data) == "object") {

            return removeObject(data)

          }

          return false;

        }
        if (prop.startsWith("findBy")) return (data) => { const field = extractField(prop.replace("findBy", "")); return target.find(item => item[field] == data); }
        if (prop.startsWith("filterBy")) return (data) => { const field = extractField(prop.replace("filterBy", "")); receiver.filter(item => item[field] == data); }
        if (prop.startsWith("sortBy")) return () => {
          const field = extractField(prop.replace("sortBy", ""));
          return target.sort((item, item2) => item[field] - item2[field]);
        }

        if (prop.startsWith("mapAll")) return (objectProperties) => { return target.map(item => { const algo = {}; for (const key in objectProperties) { algo[key] = item[key]; } return algo; }); }
        if (prop.startsWith("map")) return () => { const field = extractField(prop.replace("map", "")); return target.map(item => { return { [field]: item[field] } }); }

      }
    }

  }

}
