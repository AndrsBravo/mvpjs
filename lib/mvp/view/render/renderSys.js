import addEventStrategy from "../../../core/system/event-handlers/addEventStrategy";
/**
 * 
 * @param {import('../View').View} view 
 * @returns 
 */
export default function (view) {

  const page = view.page;
  const linkHrefSelectorCondition = `a[href]:not([href=""])`;

  if (this.matches(linkHrefSelectorCondition)) { eventToALink.apply(this, [page]); return; }

  const listOfChildrenLinks = this.querySelectorAll(linkHrefSelectorCondition);
  for (const link of listOfChildrenLinks) eventToALink.apply(link, [page]);


  const eventsProperties = this.outerHTML.match(/on\w+="\w+"/g);

  if (eventsProperties == null) return;

  const eventsPropertiesSet = new Set(eventsProperties);

  for (const property of eventsPropertiesSet) {

    if (this.matches(`[${property}]`)) addEventStrategy.apply(this, [page, property]);

    const elements = this.querySelectorAll(`[${property}]`);

    elements.forEach(element => addEventStrategy.apply(element, [page, property]));

  }


}

function eventToALink(page) { if (this.matches("[data-ignore]")) { return } addEventStrategy.apply(this, [page]); }
