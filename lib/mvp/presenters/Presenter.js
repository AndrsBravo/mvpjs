export default class Presenter {
  _name;
  _target;
  _views = [];
  _sectionViewMap = new Map();
  _target;
  _modelsMap = new Map();

  /**
   *
   * @param {String} name
   *
   */
  constructor(name) {
    this._name = name;
  }

  start() {
    console.log("Metodo start en la clase Presenter");

  }

  getName() {
    return this._name;
  }

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

  addSection(section, view) {
    const sectionName = (this.getName() + "_" + section).toLocaleLowerCase();
    console.log(`El nombre del section: ${sectionName}`);
    const sectionElement = document.getElementById(sectionName);
    this._sectionViewMap.set(sectionName, view);
    view.setTarget(sectionElement);
    view.setPresenter(this);
    view.render();
  }

  /**
   *
   * @param {string} modelName
   * @param {Model} model
   */
  addContextModel(model) {
    this._modelsMap.set(model.getName(), model);
  }

  /**
   *
   * @param {string} modelName
   * @returns Model
   */
  getContextModel(modelName) {
    return this._modelsMap.get(modelName);
  }

  setTarget(target) {
    this._target = target;
  }
}
