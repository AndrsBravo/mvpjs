import viewUtility from "../view/render/viewUtility";
import PropertyIdsCollection from "./PropertyIdsCollection";
import PropertySectionCollection from "./PropertySectionCollection";

export class Presenter {
  #name;
  #target;
  _views = [];
  _sectionObj = {};
  #propertyModelCollection;
  #propertyIdsCollection;
  /**@type PropertySectionCollection */
  #propertyCollectionSections;

  /** @param {String} name */
  constructor(name) {

    this.#name = name;
  }

  start() {
    console.log("Método start en la clase Presenter");
  }

  get name() { return this.#name; }
  set name(name) {

    if (typeof (name) == "object" && name.name) { this.#name = name.name; return; }
    this.#name = name;

  }

  /** @returns {PropertyIdsCollection} */
  get ids() {
    if (!this.#propertyIdsCollection) this.#propertyIdsCollection = new PropertyIdsCollection(this);
    return this.#propertyIdsCollection;
  }

  /** @returns void */
  async render() { }

  /** @returns {PropertySectionCollection} */
  get sections() {

    if (!this.#propertyCollectionSections) this.#propertyCollectionSections = new PropertySectionCollection(this);

    return this.#propertyCollectionSections;

  }

  /** @returns {PropertyModelCollection} */
  get models() {
    if (!this.#propertyModelCollection) this.#propertyModelCollection = new PropertyModelCollection();

    return this.#propertyModelCollection;
  }

  get target() { return this.#target; }
  set target(target) {
    this.#target = target;
  }
}

class PropertyModelCollection {

  /**
   * @type Presenter
   */
  #owner;

  /**
   * 
   * @param {Presenter} presenter 
   */
  constructor() { }

  add(models) { for (const model in models) { this[model] = models[model]; } }

}


class Id {

  #id;

  constructor(id) {
    this.#id = id;
  }

  select() {
    this.#id.element.classList.add("selected");
  }

  unselect() {
    this.#id.element.classList.remove("selected");
  }

  toggle() {
    this.#id.element.classList.toggle("selected");
  }

  html() {
    return this.#id.element;
  }

  addEventListener() {
    document.addEventListener()
  }

}

