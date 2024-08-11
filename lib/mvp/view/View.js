import { Template } from "./Template.js";
import renderView from "./render/renderView.js";
import renderSys from "./render/renderSys.js";
import { Presenter } from "../presenters/Presenter.js";
import { HTMLLiteralToHTMLTemplate, HTMLTemplateContent } from "./render/startRender";
import formatStrategy from "./render/formatStrategy";
import PropertyTemplateCollection from "./PropertyTemplateCollection";
import formatTemplate from "./render/formatTemplate.js";
import setData from "./render/setData.js";

export class View extends Presenter {
  #format;
  #model;
  #nodes = [];
  #node;
  #template;
  #templates;
  #page;
  #nodesHasChangeListeners = [];

  #nodeSymbol = Symbol("node");
  #dataNodes = new Map();

  /**
   * @param {Object} param
   * @param {String} param.name
   * @param {Template} param.template
   */
  constructor({ name, template }) {
    super(name);
    // this.#template = this.#temp(template);
    this.#template = template

    if (!template) {
      this.#template = this.#temp(document.body.innerHTML)
      document.body.innerHTML = ''
    };

    this.init();

  }

  get nodeSymbol() { return this.#nodeSymbol; }
  #temp(template) {

    let temp = "";

    if (typeof (template) == typeof ("")) temp = template;

    if (template instanceof Template) {

      //  //console.log(template.getHTML().childNodes);
      for (let index = 0; index < template.getHTML().childNodes.length; index++) {

        temp += template.getHTML().childNodes[index].outerHTML;

      }

    }

    return formatTemplate(temp);

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

    // await generateDefaultDataNodes.apply(this.#dataNodes, [this.page._page, this, this.getTemplate(), this.#symbol])
    // //console.log(this.#dataNodes.get(this.#symbol));
    // await this.#generateNewNodes(this.#symbol);

    const mode = { mode: "set" };
    await dataChangeStrategy[mode.mode].apply(this, [this.#nodeSymbol, this.#dataNodes]);
    this.#nodesHasChangeListeners.forEach(listener => listener(mode));

  }

  get templates() { if (!this.#templates) { this.#templates = new PropertyTemplateCollection(); } return this.#templates; }
  getTemplate() { return this.#template; }

  select() {

    if (!this.#dataNodes.has(this.#nodeSymbol)) return;
    this.#dataNodes.get(this.#nodeSymbol).forEach(element => element.classList.toggle("selected"));
  }

  /** @param {Model} model  */
  setModel(model) {
    this.#model = model;
    this.#model.addDataEventListener(this.#modelDataChangeListener);

    if (this.#node) {
      // //console.log("### ", this.#node);
      this.target.removeChild(this.#node);
    }
  }

  #modelDataChangeListener = async (dataChanged) => {

    console.log(dataChanged);

    const [key, data] = Object.entries(dataChanged)[0];
    if (!key in dataChangeStrategy) return;
    await dataChangeStrategy[key].apply(this, [data, this.#dataNodes]);
    this.#nodesHasChangeListeners.forEach(listener => listener({ mode: key }));

  };

  addTemplate(template) {
    for (const name in template) this.#templates[name] = this.#temp(template[name]);
  }

  set page(presenter) {
    this.#page = presenter;
  }

  get page() {
    return this.#page;
  }

  async removeAllNode() {

    clearDataNodes(null, this.#dataNodes)
    //  for (const entry of this.#dataNodes) { this.#dataNodes.delete(entry[0]); await removeDataNodes(entry[1]) }
  }
}

const dataChangeStrategy = { set: updateAllExistingNodes, add: generateNewNodes, filter: updateAllExistingNodes, clear: clearDataNodes, delete: deleteDataNodes }

/**
 * 
 * @param {Map} dataNodes 
 */
async function deleteDataNodes(data, dataNodes) {

  if (!data) return

  data.forEach(
    (item) => {
      removeDataNodes(dataNodes.get(item[Symbol.for("item")]))
      dataNodes.delete(item[Symbol.for("item")])
    }
  )

}

/**
 * 
 * @param {Map} dataNodes 
 */
async function clearDataNodes(data, dataNodes) {

  for (const entry of dataNodes) { dataNodes.delete(entry[0]); await removeDataNodes(entry[1]) }

  dataNodes.clear()

}

async function updateAllExistingNodes(data, dataNodes) {

  //console.log({ data, dataNodes });

  await clearDataNodes(data, dataNodes);
  await generateNewDataNodes.apply(this, [data, dataNodes, renderFunction]);

}

async function generateNewNodes(data, dataNodes) {

  await generateNewDataNodes.apply(this, [data, dataNodes, renderFunction]);

}

async function generateNewDataNodes(data, dataNodes, renderFunction) {

  const renderNewNodes = async (item) => {

    if (!(typeof (item) == "symbol") && !item[Symbol.for("item")]) item[Symbol.for("item")] = self.crypto.randomUUID().substring(24);

    //console.log("*** renderNewNodes ***");
    //console.log(this);
    //console.log(this.page.meta);

    let htmlFilled = setData(this.page.meta, {}, item, this.getTemplate(), this);
    let temp = HTMLLiteralToHTMLTemplate(htmlFilled);
    temp = HTMLTemplateContent(temp);
    const nodes = Array.from(temp.content.childNodes);
    ////console.log(nodes);
    //console.log("============== Item to render");
    //console.log(item);
    await renderFunction.apply(this, [item, nodes]);

    dataNodes.set(item[Symbol.for("item")] || item, nodes)

  };

  if (typeof (data) == "symbol") return await renderNewNodes(data)
  for (const dato of data) { await renderNewNodes(dato) }

}

async function renderFunction(item, nodes) {

  renderNewDataNodes.apply(this.target, [this, nodes])

}

async function renderNewDataNodes(view, nodes) {

  //console.log("rendering nodes", nodes);
  for (const node of nodes) {
    if (node.nodeName == "#comment") continue

    this.appendChild(node);
    // //console.log(node);
    await renderView.apply(node, [view]);
    await renderSys.apply(node, [view]);
  }

}

async function removeDataNodes(nodes) {

  //console.log("Node to remove");
  //console.log(nodes);

  for (const node of nodes) node.parentElement.removeChild(node);

}