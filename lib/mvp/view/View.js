import Template from "./Template.js";
import { renderView } from "./render/renderView.js";
import { renderNode } from "./render/renderNode.js";
import { renderSys } from "./render/renderSys.js";
import Presenter from "../presenters/Presenter.js";

export default class View extends Presenter {
  #model;
  #nodes = [];
  #node;
  #nodeChangeListeners = [];
  #sectionOf;
  #template;
  #presenter;
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
  }

  render() {
    this.#generateNode();
  }

  #generateNode() {
    if (this.#model) {
      return;
    }

    if (!this.#node) {
      this.#node = renderView(this);
      renderSys(this.#node, this.#presenter);
    }

    this._target.appendChild(this.#node);

    for (const [sectionName, view] of this._sectionViewMap) {
      const target = document.getElementById(sectionName);
      view.setPresenter(this.#presenter);
      view.setTarget(target);
      view.render();
    }
  }

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

  #modelDataChangeListener = (data) => {
    const documentFragment = new DocumentFragment();

    data.forEach((item) => {
      if (item["_bindId"] && item["_bindId"].length > 0) {
        if (this.#updateExistingNode(item)) return;
      }

      const newNode = renderView(this);
      renderNode(item, newNode);
      renderSys(newNode, this.#presenter);
      documentFragment.appendChild(newNode);
    });

    this._target.appendChild(documentFragment);
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
  addSection(section, view) {
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
    this._sectionViewMap.set(sectionName, view);

    if (!this.#presenter) {
      return;
    }

    const target = document.getElementById(sectionName);
    view.setPresenter(this.#presenter);
    view.setTarget(target);
    view.render();
  }

  setPresenter(presenter) {
    this.#presenter = presenter;

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