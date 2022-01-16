import Presenter from "../presenters/Presenter.js";

export default class extends Presenter {
  _ownSection;
  _formName;
  #layout;

  /**
   * @param {Object} obj
   * @param {String} obj.name
   * @param {Map<string,View>} obj.sections
   */
  constructor(name, sections) {
    super(name);
    this._ownSection = sections;
    this._formName = name;
  }

  render() {
    for (const section in this._ownSection) {
      if (!Object.hasOwnProperty.call(this._ownSection, section)) {
        return;
      }

      let target = document.body;

      if (this.#layout) {
        target = document.getElementById(
          (this.#layout.getName() + "_" + section).toLocaleLowerCase()
        );
      }

      const view = this._ownSection[section];

      view.setTarget(target);
      view.setSectionOf(this.getFormName());
      view.setPresenter(this);
      view.render();
    }
  }

  addSection(section, view) {
    const sectionName = (
      this.getFormName() +
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
  getFormName() {
    return this._formName;
  }
  /**
   *
   * @param {string} formName
   */
  setFormName(formName) {
    this._formName = formName;
  }

  setLayout(layout) {
    this.#layout = layout;
    this.render();
  }
}
