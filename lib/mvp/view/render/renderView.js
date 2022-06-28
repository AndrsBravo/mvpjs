export default function (view, html) {


    const setSection = section => section.id = ((view.getSectionOf() ? view.getSectionOf() + "_" : view.getName() + "_") + section.dataset.section).toLocaleLowerCase();

    if (html.matches("[data-section]")) setSection(html);

    const sections = html.querySelectorAll("*[data-section]");

    sections.forEach(setSection);

    const setId = el => {


        if ((el instanceof HTMLElement) == false) return;

        if (el.id.lenght < 1) return;

        let id = ((view.getSectionOf() ? `${view.getSectionOf()}_${view.getName()}_` : view.getName() + "_") + el.id).toLocaleLowerCase();

        const object = { id: el.id, element: el, longId: id };

        if (el.matches("[data-section]")) { object.id = el.dataset.section; view.addId(object); return };

        el.id = id;
        view.addId(object);


    };

    if (html.matches("[id]")) setId(html);

    const ids = html.querySelectorAll("*[id]");

    ids.forEach(setId);

    return html;
}
