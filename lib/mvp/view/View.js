import {Template} from "./Template.js";
import renderNode from "./render/renderNode.js";
import renderView from "./render/renderView.js";
import renderSys from "./render/renderSys.js";
import {Presenter} from "../presenters/Presenter.js";
import startRender from "./render/startRender";

export  class View extends Presenter {
  #model;
  #nodes = [];
  #node;
  #nodeChangeListeners = [];
  #sectionOf;
  #template;
  #templates = {};
  #page;
  #parent;

  /**
   *
   * @param {Object} param
   * @param {String} param.name
   * @param {Template} param.template
   *
   */
  constructor({ name, template }) {
    super(name);
    this.#template = template;
    this.init();
  }

  init() { }

  render() {
    this.#generateNode();
  }

  #generateNode() {
    if (this.#model) {
      return;
    }

    if (!this.#node) {
      /* this.#node =   renderNode({page:this.#page._page}, this);
      renderSys(this.#node, this.#page);*/


    }

    startRender(this.#page._page, this, this.getTemplate(), this._target, {});
    this.#node = this._target.lastElementChild;
    renderView(this, this.#node);

    renderSys(this.#node, this.#page);

    for (const sectionName in this._sectionObj) {
      const view = this._sectionObj[sectionName];
      const target = document.getElementById(sectionName);
      view.setPresenter(this.#page);
      view.setTarget(target);
      view.render();
    }
  }
  templates() { return this.#templates; }

  getTemplate() {
    return this.#template;
  }

  select() {
    if (!this.#node) {
      return;
    }

    this.#node.classList.toggle("selected");
  }

  /** @param {Model} model  */
  setModel(model) {
    this.#model = model;
    this.#model.addDataEventListener(this.#modelDataChangeListener);

    if (this.#node) {
      this._target.removeChild(this.#node);
    }
  }

  #modelDataChangeListener = async (data) => {
    console.log(data);
    await startRender(this.#page._page, this, this.getTemplate(), this._target, data);
    this.#node = this._target.lastElementChild;
    console.log("----El node");
    console.log(this.#node);
    console.log(this._target);
    renderView(this, this.#node);

    renderSys(this.#node, this.#page);;
  };
  
  #updateExistingNode(item) {
    const node = document.querySelector(`[data-bindid='${item._bindId}']`);

    if (!node) return false;

    renderNode(item, node);
    return true;
  }

  /**
   *
   * @param {String} section
   * @param {View} view
   */
  sections(section, view) {
    /*
            if (this.#presenter) {
    
                view.setPresenter(this.#presenter);
    
            }
            
            const sectionName = (this.getName() + "_" + section).toLocaleLowerCase();
            this._sectionViewMap.set(sectionName, view);
            view.setPresenter(this.#presenter);
    
            view.addNodeChangeListener(node => {
                document.getElementById(sectionName).appendChild(node);
            });
        */

    const sectionName = (this.getName() + "_" + section).toLocaleLowerCase();
    this._sectionObj[sectionName] = view;

    if (!this.#page) {
      return;
    }

    console.log(this.id());

    const target = document.getElementById(this.getSectionOf() + "_" + section);
    console.log("---El target para la vista en otra vista", target)
    console.log(this.getSectionOf() + "_" + this.getName());
    view.setPresenter(this.#page);
    view.setTarget(target);
    view.render();
  }

  addTemplate(template) {
    for (const name in template) this.#templates[name] = template[name];
  }

  setPresenter(presenter) {
    this.#page = presenter;
    this.#sectionOf = presenter.getName();

    //  this._sectionViewMap.forEach(entry => entry.render());
  }

  setParent(parent) {
    this.#parent = parent;
  }

  setSectionOf(sectionOwns) {
    this.#sectionOf = sectionOwns;
  }

  getSectionOf(sectionOwns) {
    return this.#sectionOf;
  }
  removeAllNode() {
    if (this.#node) {
      this.#node.parentElement.removeChild(this.#node);
    }
  }
}
