import Presenter from "../presenters/Presenter.js";

export default class extends Presenter {
  /**
   *
   * @param {Object} param
   * @param {String} param.name
   * @param {String} param.target
   * @param {View} param.view
   *
   */
  constructor({ name, view }) {
    super(name);
    this._views.push(view);
    this.render();
  }

  render() {
   // console.log("Las vistas que se van a renderizar");
   // console.log(this._views);
    this._views.forEach((view) => {
      view.setTarget(document.body);
      view.setSectionOf(this._name);
      view.setPresenter(this);
      view.render();
    });
  }

  sections(section, view) {
    const sectionName = (this.getName() + "_" + section).toLocaleLowerCase();
    const sectionElement = document.getElementById(sectionName);
    this._sectionObj.set(sectionName, view);
    view.setTarget(sectionElement);
    view.setPresenter(this);
    view.render();
  }

  start() {
    console.log("Se llama el start");
  }
}
