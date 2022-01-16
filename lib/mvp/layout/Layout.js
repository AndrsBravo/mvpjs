import Presenter from "../presenters/Presenter.js";
import View from "../view/View.js";

export default class extends Presenter {
  /**
   *
   * @param {Object} param
   * @param {String} param.name
   * @param {String} param.target
   * @param {View} param.view
   *
   */
  constructor({ name, target, view }) {
    super(name);
    this._target = target;
    this._views.push(view);
    this.render();
  }

  render() {
    this._views.forEach((view) => {
      view.setTarget(this._target);
      view.setSectionOf(this._name);
      view.setPresenter(this);
      view.render();
    });
  }

  addSection(section, view) {
    const sectionName = (this.getName() + "_" + section).toLocaleLowerCase();
    const sectionElement = document.getElementById(sectionName);
    this._sectionViewMap.set(sectionName, view);
    view.setTarget(sectionElement);
    view.setPresenter(this);
    view.render();
  }

  start() {
    console.log("Se llama el start");
  }
}
