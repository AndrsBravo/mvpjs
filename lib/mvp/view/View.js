import { Template } from "./Template.js";
import renderView from "./render/renderView.js";
import renderSys from "./render/renderSys.js";
import { Presenter } from "../presenters/Presenter.js";
import { addNodesRender, updateNodesRender, globalRender } from "./render/startRender";
import formatStrategy from "./render/formatStrategy";
import PropertySectionCollection from "../presenters/PropertySectionCollection.js";
import PropertyTemplateCollection from "./PropertyTemplateCollection";

export class View extends Presenter {
  #format;
  #model;
  #nodes = [];
  #node;
  #template;
  #templates;
  #page;
  #propertyCollectionSections;
  #nodesHasChangeListeners = [];
  #dataChangeStrategy = { set: this.#updateAllExistingNodes, add: this.#generateNewNodes, filter: this.#updateAllExistingNodes }

  /**
   * @param {Object} param
   * @param {String} param.name
   * @param {Template} param.template
   */
  constructor({ name, template }) {
    super(name);
    this.#template = template;
    this.init();
  }

  init() {

    this.#format = { ...formatStrategy, ...this.viewFormat() };

  }



  addNodeHasChangeListener(listener) {

    if (listener) this.#nodesHasChangeListeners.push(listener);

  }

  viewFormat() { }

  get format() {
    return this.#format;
  }

  async render() {
    if (this.#model) return;
    await this.#generateNewNodes(null);
    this.#nodesHasChangeListeners.forEach(listener => listener({ mode: "set" }));
  }

  async #generateNewNodes(data) {

    const target = await addNodesRender(this.#page._page, this, this.getTemplate(), this._target, data);
    renderView(this.#page, this, target);
    renderSys(target, this.#page);
    this.#nodes = [...this.#nodes, ...target];

  }

  async #updateAllExistingNodes(data) {

    const nodesDdded = await globalRender(this.#page._page, this, this.getTemplate(), this._target, data, this.#nodes);
    if (nodesDdded) this.#nodes = [...this.#nodes, ...nodesDdded];
    renderView(this.#page, this, this.#nodes);
    renderSys(this.#nodes, this.#page);

    console.log(this.#nodes);

  }

  get templates() { if (!this.#templates) { this.#templates = new PropertyTemplateCollection(); } return this.#templates; }
  getTemplate() { return this.#template; }

  select() {

    if (this.#nodes.length < 1) return;
    this.#nodes.forEach(node => node.forEach(element => element.classList.toggle("selected")));
  }

  /** @param {Model} model  */
  setModel(model) {
    this.#model = model;
    this.#model.addDataEventListener(this.#modelDataChangeListener);

    if (this.#node) {
      console.log("### ", this.#node);
      this._target.removeChild(this.#node);
    }
  }

  #modelDataChangeListener = async (dataChanged) => {

    const [key, data] = Object.entries(dataChanged)[0];
    if (!key in this.#dataChangeStrategy) return;
    await this.#dataChangeStrategy[key].call(this, data);
    this.#nodesHasChangeListeners.forEach(listener => listener({ mode: key }));

  };

  addTemplate(template) {
    for (const name in template) this.#templates[name] = template[name];
  }

  set presenter(presenter) {
    this.#page = presenter;
  }

  get presenter() {
    return this.#page;
  }

  get sections() {
    if (!this.#propertyCollectionSections) this.#propertyCollectionSections = new PropertySectionCollection(this.#page);
    return this.#propertyCollectionSections;
  }

  removeAllNode() {
    if (this.#node) {
      this.#node.parentElement.removeChild(this.#node);
    }
    if (this.#nodes) {
      console.log(this.#nodes[0]);
      this.#nodes.forEach(node => {

        if(node instanceof Array){ 
          node.forEach(otronode => otronode.parentElement.removeChild(otronode));
          return;}

        node.parentElement.removeChild(node);

      });
    }
  }
}
