import viewUtility from "../view/render/viewUtility";
export class Presenter {
  _name;
  _target;
  _views = [];
  _sectionObj = {};
  _target;
  #propertyModelCollection ;
  ids = {};
  _utility;
  /**@type PropertySectionCollection */
  #propertyCollectionSections;

  /**
   *
   * @param {String} name
   *
   */
  constructor(name) {
    this._name = name;
    this._utility = viewUtility;
  }

  start() {
    console.log("Metodo start en la clase Presenter");
  }

  getName() {
    return this._name;
  }

  addId(id) {

    if (!id && !id.id) return;

    this.ids[id.id] = new Id(id);

  }

  id() { return this.ids; }

  /**
   * @returns void
   */
  async render() {
    // this._views.forEach(view => this.#renderNode(view.getNode(this)));
  }

  /**
   *
   * @param {String} section
   * @param {View} view
   */
  /*
    sections(section, view) {
      const sectionName = (this.getName() + "_" + section).toLocaleLowerCase();
      console.log(`El nombre de la section: ${sectionName}`);
      const sectionElement = document.getElementById(sectionName);
      this._sectionObj[sectionName] = view;
      view.setTarget(sectionElement);
      view.setPresenter(this);
      view.render();
    }*/

  /**
  * 
  * @returns PropertySectionCollection
  */
  get sections() {

    if (!this.#propertyCollectionSections) this.#propertyCollectionSections = new PropertySectionCollection(this);

    return this.#propertyCollectionSections;

  }

  section() {
    return this._sectionObj;
  }

 /**
  * @returns PropertyModelCollection
  */
  get models() {
    if (!this.#propertyModelCollection) this.#propertyModelCollection = new PropertyModelCollection();

    return this.#propertyModelCollection;
  }



  setTarget(target) {
    this._target = target;
  }
}

class Id {
  #id;
  constructor(id) {
    this.#id = id;
  }

  /**
   * 
   * @param {[string]} query 
   * @returns void
   */
  select() {
    this.#id.element.classList.add("selected");
  }

  unselect() {
    this.#id.element.classList.remove("selected");
  }

  html() {
    return this.#id.element;
  }
}


class PropertySectionCollection {

  /**
   * @type Presenter
   */
  #owner;

  /**
   * 
   * @param {Presenter} presenter 
   */
  constructor(presenter) {
    this.#owner = presenter;
  }

  add(sections) {

    for (const section in sections) {
      const view = sections[section];
      const sectionName = (this.#owner.getPageName() + "_" + section).toLocaleLowerCase();
      const sectionElement = document.getElementById(sectionName);
      this[section] = view;
      view.setTarget(sectionElement);
      view.setPresenter(this.#owner);
      view.render();
    }

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