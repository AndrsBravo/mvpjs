import eventStrategy from "../../../core/system/event-handlers/eventStrategy";

export default function (nodes, presenter) {

  const setter = htmlElemet => {

    //const hrefSelector = "a[href]";
    const hrefSelector = `a[href]:not([href=""])`;
    const dataOnSelector = "[data-on]";

    if (htmlElemet.matches && htmlElemet.matches(hrefSelector)) { if(htmlElemet.matches("[data-ignore]")) { return} eventStrategy(htmlElemet, presenter); }

    var links = htmlElemet.querySelectorAll(hrefSelector);

    links.forEach(link => { if(link.matches("[data-ignore]")) { return}  eventStrategy(link, presenter); });

    if (htmlElemet.matches && htmlElemet.matches(dataOnSelector)) {
      //  console.log("======== Add event to ======");
      //  console.log(htmlElemet);

      eventStrategy(htmlElemet, presenter)
    }

    const events = htmlElemet.querySelectorAll(dataOnSelector);
    events.forEach(element => eventStrategy(element, presenter));
  }

  nodes.forEach(node => node.forEach(setter));
}
