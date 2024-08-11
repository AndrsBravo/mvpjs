import { Presenter } from "../presenters/Presenter.js";

export class Page extends Presenter {
  #meta = {};
  _ownSection;
  #layout;

  /**
   * @param {Object} param
   * @param {String} param.name
   * @param {Map<string,import("@/mvp/view/View.js").View>} param.sections
   */
  constructor({ name, sections }) {
    super(name);
    if (typeof (name) == "object") { this.#meta = name; }
    this._ownSection = sections;
  }

  async render() {

    for (const section in this._ownSection) {
      this._ownSection[section].page = this;
    }

    if (this.#layout) {
      //console.log(this._ownSection);
      //console.log(this.#layout);
      await this.#layout.sections.add(this._ownSection);
    }
  }

  async setLayout(layout) {
    this.#layout = layout;
    //console.log("=========las sectiondel Layout=========");
    //console.log(this.#layout.sections);
    await this.render();
  }

  get meta() { return this.#meta; }
  set meta(data) {
    if (data) { this.#meta = { ...this.#meta, ...data }; }
  }

  show() {
    for (const section in this._ownSection) {
      const view = this._ownSection[section];
      view.select();
    }
  }

  hide() {
    for (const section in this._ownSection) {
      const view = this._ownSection[section];
      view.select();

    }
  }

  redirect(url) {
    this.#meta.redirectRoute(url);
    // this.close();
  }

  route(url) {
    this.#meta.callCreateRoute(url);
  }

  destroy() { }

  close() {

    for (const section in this._ownSection) {
      const view = this._ownSection[section];
      view.removeAllNode();
    }
    this.#meta.deactivateRoute(this.#meta.href);
  }

}

