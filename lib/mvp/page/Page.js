import { Presenter } from "../presenters/Presenter.js";

export class Page extends Presenter {
  _page = {};
  _ownSection;
  #layout;

  /**
   * @param {String} name
   * @param {Map<string,View>} sections
   */
  constructor({ name, sections }) {
    super(name);
    if (typeof (name) == "object") { this._page = name; }
    this._ownSection = sections;
  }

  async render() {

    for (const section in this._ownSection) {
      this._ownSection[section].presenter = this;
    }

    if (this.#layout) {
      await this.#layout.sections.add(this._ownSection);

    }
  }

  async setLayout(layout) {
    this.#layout = layout;
    await this.render();
  }

  meta(data) {
    if (data) { this._page = { ...this._page, ...data }; console.log(this._page); }
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
    console.log(this._page);
    this._page.redirectRoute(url);
    // this.close();
  }

  destroy() { }

  close() {

    for (const section in this._ownSection) {
      const view = this._ownSection[section];
      view.removeAllNode();
    }
    this._page.unactivateRoute(this._page.href);
  }

}

