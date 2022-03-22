import Presenter from "../presenters/Presenter.js";

export default class extends Presenter {
  _ownSection;
  _pageName;
  #layout;

  /**
   * @param {Object} obj
   * @param {String} obj.name
   * @param {Map<string,View>} obj.sections
   */
  constructor({ name, sections }) {
    super(name);
    this._ownSection = sections;
    this._pageName = name;
  }

  render() {
    console.log("----Rendering Page");
    for (const section in this._ownSection) {
      let target = document.body;

      if (this.#layout) {
        target = document.getElementById(
          (this.#layout.getName() + "_" + section).toLocaleLowerCase()
        );
      }

      const view = this._ownSection[section];

      view.setTarget(target);
      view.setSectionOf(this.getPageName());
      view.setPresenter(this);
      view.render();
    }
  }

  addSection(section, view) {
    const sectionName = (
      this.getPageName() +
      "_" +
      section
    ).toLocaleLowerCase();
    const sectionElement = document.getElementById(sectionName);
    this._sectionViewMap.set(sectionName, view);
    view.setTarget(sectionElement);
    view.setPresenter(this);
    view.render();
  }

  /**
   *
   * @returns string
   */
  getPageName() {
    return this._pageName;
  }
  /**
   *
   * @param {string} pageName
   */
  setPageName(pageName) {
    this._pageName = pageName;
  }

  setLayout(layout) {
    this.#layout = layout;
    this.render();
  }
}
