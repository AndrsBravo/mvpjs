
export default class PropertySectionCollection {

  /** @type Presenter */
  #owner;

  /** @param {Presenter} presenter */
  constructor(presenter) {
    this.#owner = presenter;
  }

  async add(sections) {

   // console.log("Section to add",this.#owner.name);
   // console.log(sections);

    for (const section in sections) {

      if (typeof (sections[section]) == "string") { await this.#addAsSectionId(section, sections[section]); continue; }
      if (typeof (sections[section]) == "object") { await this.#addAsView(section, sections[section]); continue; }

    }
  }

  async #addAsView(section, view) {
    // if (!view.presenter) console.log(this.#owner.name);
    const sectionElement = document.getElementById(this[section].id);
    this[section]["view"] = view;
    view.setTarget(sectionElement);
    if (!view.presenter) view.presenter = this.#owner;
    await view.render();

  }

  async #addAsSectionId(section, sectionId) {
    this[section] = { id: sectionId };
  }

}