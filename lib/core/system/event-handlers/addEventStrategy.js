import eventDelayMode from "./eventDelayMode";
import eventHandlers from "./eventHandlers";

/**
 * 
 * @param {import("../../../mvp/page/Page").Page} page 
 * @param {GlobalEventHandlers} globalEventHandlerType 
 * @returns void
 */
async function addEventStrategy(page, globalEventHandlerType) {

    if (this == null || undefined) return;

    if (this.matches("a[href]")) {
        const eventsManager = await eventHandlers.link(eventDelayMode(this, "onclick"));
        this.onclick = eventsManager.listener;
        return;
    }


    const eventObject = eventPropertyToEvent(globalEventHandlerType);

    if (eventObject.eventType.length < 1) return;
    if (!page[eventObject.listener]) {   

        console.log("La pagina: ", page.name);
        console.log("No contiene el manejador de eventos: ",eventObject.listener )

        return;}


    const eventTypes = [`${this.type}${eventObject.event}`, eventObject.event, "event"];

    for (const eventType of eventTypes) {

        if (Object.hasOwnProperty.call(eventHandlers, eventType)) {

            eventObject.eventType = eventType;
            break;

        }

    }

    const eventManager = await eventHandlers[eventObject.eventType](page[eventObject.listener], page, eventDelayMode(this, eventObject.eventName));

    if (this[eventObject.eventName]) this[eventObject.eventName] = eventManager.listener;



}

export default addEventStrategy;

/**
 * @typedef EventObject
 * @property {string} eventName
 * @property {string} eventType
 * @property {string} eventListener
 * 
 * @param {string} eventProperty 
 * @returns {EventObject}
 */

function eventPropertyToEvent(eventProperty) {

    const [name, value] = eventProperty.split('="');

    let event = name.replace("on", "");
    const eventListener = value.replace('"', "")

    return {
        eventName: name,
        eventType: event,
        listener: eventListener
    }

}