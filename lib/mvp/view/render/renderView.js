export function renderView(view) {

    let html = view.getTemplate().getHTML();

    const setSection = section => section.id = ((view.getSectionOf() ? view.getSectionOf() + "_" : view.getName() + "_") + section.dataset.section).toLocaleLowerCase();    
    html.matches("[data-section]") ? setSection(html) : null;

    const sections = html.querySelectorAll("*[data-section]");

    sections.forEach(setSection);

    return html;
}
