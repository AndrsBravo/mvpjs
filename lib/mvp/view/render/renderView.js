export default function (page, view, nodes) {

    const setter = html => {

        const setElementId = el => {

            if (!(el instanceof HTMLElement)) return;

            if (el.id.lenght < 1) return;

            let id = ((page.name ? `${page.name}_${view.name}_` : view.name + "_") + el.id).toLocaleLowerCase();

            const object = { id: el.id, element: el, longId: id, scope: {} };

            if (el.matches("[data-section]")) { object.id = el.dataset.section; view.ids.add({ ...object }); page.ids.add({ ...object }); return }

            el.id = id;
            page.ids.add({ ...object });
            view.ids.add({ ...object });


        };

        const setForProperty = el => {

            if (!(el instanceof HTMLElement)) return;           

            if (el.getAttribute("for").lenght < 1) return;

            let id = ((page.name ? `${page.name}_${view.name}_` : view.name + "_") + el.getAttribute("for")).toLocaleLowerCase();           
          
            el.setAttribute("for",id);         

        };

        const setElementSection = elementAsSection => {

            const sectionId = ((page.name ? `${page.name}_${view.name}_` : view.name + "_") + elementAsSection.dataset.section).toLocaleLowerCase();
            elementAsSection.id = sectionId;
            const section = {};
            section[elementAsSection.dataset.section] = sectionId;
            view.sections.add(section);
            page.sections.add(section);

        }

        if (html.matches && html.matches("[data-section]")) setElementSection(html);

        const sections = html.querySelectorAll("*[data-section]");

        sections.forEach(setElementSection);

        if (html.matches && html.matches("[id]")) setElementId(html);       

        const ids = html.querySelectorAll("*[id]");

        ids.forEach(setElementId);

        if (html.matches && html.matches("[for]")) setForProperty(html);
        const fors = html.querySelectorAll("*[for]");
        fors.forEach(setForProperty);

    };

    nodes.forEach(node => node.forEach(setter));

}
