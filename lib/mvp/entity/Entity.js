export default class {
  #name;
  #entity;
  #config;
  #level = 0;
  #data = [];

  constructor(name, entity, config) {
    this.#name = name;
    this.#entity = entity;
    this.#config = config;
  }

  getName() {
    return this.#name;
  }
  getEntity() {
    return this.#entity;
  }
  getLevel() {
    return this.#level;
  }
  getData() {
    return this.#data;
  }
  setData(data) {
    this.#data = data;
  }

  addData(data) {
    if (data instanceof Array) {
      data.forEach((dato) => this.#data.push(dato));
      return;
    }

    this.#data.push(data);
  }
}
