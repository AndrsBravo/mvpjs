class MemoryData {

    static #data = new Map();
  
    static #actionFn(object) {
      return (item) => {
        const has = [];
        Object.keys(object).forEach(key => has.push(object[key] === item[key]));
        return has.every(value => value === true);
      }
    }
  
    static find(dataKey, object) {
  
      if (!this.#data.has(dataKey)) return;
      const data = this.#data.get(dataKey);
      return data.find(this.#actionFn(object));
    }
  
    static findAll(dataKey, object) {
  
      if (!this.#data.has(dataKey)) return;
      const data = this.#data.get(dataKey);
      return data.filter(this.#actionFn(object));
    }
  
    static get(dataKey) { return this.#data.get(dataKey); }
    static add(dataKey, data) {
      if (!this.#data.has(dataKey)) { this.#data.set(dataKey, data); return; }
      this.#data.set(dataKey, [...this.#data.get(dataKey), ...data]);
    }
    static remove(dataKey) { this.#data.delete(dataKey) }
    static set(dataKey, data) { this.#data.set(dataKey, data); }
  
  }