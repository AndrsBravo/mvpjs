import { Presenter } from "../presenters/Presenter.js";

export class Page extends Presenter {
  #meta = {};
  _ownSection;
  #layout;

  /**
   * @param {String} name
   * @param {Map<string,View>} sections
   */
  constructor({ name, sections }) {
    super(name);
    if (typeof (name) == "object") { this.#meta = name; }
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
    if (data) { this.#meta = { ...this.#meta, ...data }; console.log(this.#meta); }
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
    console.log(this.#meta);
    this.#meta.redirectRoute(url);
    // this.close();
  }

  destroy() { }

  close() {

    for (const section in this._ownSection) {
      const view = this._ownSection[section];
      view.removeAllNode();
    }
    this.#meta.unactivateRoute(this.#meta.href);
  }

}

