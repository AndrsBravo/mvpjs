import Presenter from "../presenters/Presenter.js";

export default class extends Presenter {
  _page = {};
  _ownSection;
  #layout;

  /**
   * @param {String} name
   * @param {Map<string,View>} sections
   */
  constructor({ name, sections }) {
    super(name);
    this._ownSection = sections;
  }

  render() {
    // console.log("----Rendering Page");
    for (const section in this._ownSection) {
      let target;

      if (this.#layout) {
        target = document.getElementById(
          (this.#layout.getName() + "_" + section).toLocaleLowerCase()
        );
      }

      if (!target) {
        target = document.body;
      }

      const view = this._ownSection[section];

      view.setTarget(target);
      view.setSectionOf(this.getPageName());
      view.setPresenter(this);
      view.render();
    }
  }
 

  /**
   *
   * @returns string
   */
  getPageName() {
    return this._name;
  }
  /**
   *
   * @param {string} pageName
   */
  setName(pageName) {
    this._name = pageName;
  }

  setLayout(layout) {
    this.#layout = layout;
    this.render();
  }

  meta(data) {
    if (data) { this._page = { ...this._page, ...data } }
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

  destroy() { }

  close() {
    console.log("Clicaste el close");

    for (const section in this._ownSection) {

      const view = this._ownSection[section];
      view.removeAllNode();
    }


    this._page.unactivateRoute(this._page.routeId);

  }

  open() {

    this._page.routeNotification(this._page.routeId);
  }

}

