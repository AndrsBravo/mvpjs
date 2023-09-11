import addEventStrategy from "../../../core/system/event-handlers/addEventStrategy";

export default function (nodes, presenter) {

  const setter = htmlElement => {
   
    const hrefSelector = `a[href]:not([href=""])`;
    const dataOnSelector = "[data-on]";

    const eventToALink = link => { if (link.matches("[data-ignore]")) { return } addEventStrategy(link, presenter); }

    if (htmlElement.matches && htmlElement.matches(hrefSelector)) eventToALink(htmlElement)

    var links = htmlElement.querySelectorAll(hrefSelector);

    links.forEach(eventToALink);

    const eventsProperties = htmlElement.outerHTML.match(/on\w+="\w+"/g);

    if (eventsProperties == null) return;

    const eventsPropertiesSet = new Set(eventsProperties);

    eventsPropertiesSet.forEach(property => {

      if (htmlElement.matches(`[${property}]`)) addEventStrategy(htmlElement, presenter,property);

      const elements = htmlElement.querySelectorAll(`[${property}]`);

      elements.forEach(element => addEventStrategy(element, presenter,property));

    });

  }

  nodes.forEach(setter);
}
