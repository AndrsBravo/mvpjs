/**
 * 
 * @param {import("../View").View} view 
 */
export default async function (view) {

    // //console.log(this.nodeName);

    if (this.matches("[data-section]")) setElementAsSection.apply(this, [view]);
    const listOfChildrenSections = this.querySelectorAll("*[data-section]");


    for (const section of listOfChildrenSections) { await setElementAsSection.apply(section, [view]) }


    if (this.matches("[id]")) setElementId.apply(this, [view]);
    const listOfChildrenWithIds = this.querySelectorAll("*[id]");
    for (const child of listOfChildrenWithIds) setElementId.apply(child, [view]);

    if (this.matches("[for]")) setForProperty.apply(this, [view]);
    const listOfChildrenWithForPropertySet = this.querySelectorAll("*[for]");
    for (const child of listOfChildrenWithForPropertySet) setForProperty.apply(child, [view]);

    if (this.matches("[list]")) setListProperty.apply(this, [view]);
    const listOfChildrenWithListPropertySet = this.querySelectorAll("*[list]");
    for (const child of listOfChildrenWithListPropertySet) setListProperty.apply(child, [view]);


}

async function setElementAsSection(view) {

    const sectionId = ((view.page.name ? `${view.page.name}_${view.name}_` : view.name + "_") + this.dataset.section).toLocaleLowerCase();

    this.id = sectionId;
    const section = {};
    section[this.dataset.section] = sectionId;
    // view.sections.add(section);
    view.page.sections.add(section);

}



function setElementId(view) {

    if (!(this instanceof HTMLElement)) return;

    if (this.id.length < 1) return;

    let id = ((view.page.name ? `${view.page.name}_${view.name}_` : view.name + "_") + this.id).toLocaleLowerCase();

    const object = { id: this.id, element: this, longId: id, scope: {} };

    if (this.matches("[data-section]")) { object.id = this.dataset.section; view.ids.add({ ...object }); view.page.ids.add({ ...object }); return }

    this.id = id;
    view.page.ids.add({ ...object });
    view.ids.add({ ...object });


}

function setForProperty(view) {

    if (!(this instanceof HTMLElement)) return;

    if (this.getAttribute("for").length < 1) return;

    let id = ((view.page.name ? `${view.page.name}_${view.name}_` : view.name + "_") + this.getAttribute("for")).toLocaleLowerCase();

    this.setAttribute("for", id);

}

function setListProperty(view) {

    if (!(this instanceof HTMLElement)) return;

    if (this.getAttribute("list").length < 1) return;

    let id = ((view.page.name ? `${view.page.name}_${view.name}_` : view.name + "_") + this.getAttribute("list")).toLocaleLowerCase();

    this.setAttribute("list", id);

}
