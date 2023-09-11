import eventDelayMode from "./eventDelayMode";
import eventHandlers from "./eventHandlers";
const addEventStrategy = async (el, presenter, eventProperty) => {

    if (el == null || undefined) return;

    if (el.matches("a[href]")) {
        const eventsManager = await eventHandlers.link(eventDelayMode(el, "onclick"));
        el.onclick = eventsManager.listener;
        return;
    }

    const [name, value] = eventProperty.split('="');

    let event = name.replace("on", "");
    const eventListener = value.replace('"', "")

    if (event.length < 1) return;
    if (!presenter[eventListener]) return;

    if (event == "change" && eventHandlers.hasOwnProperty(`${el.type}${event}`)) {

        event = `${el.type}${event}`;

    }

    if (!eventHandlers.hasOwnProperty(event)) event = "event";

    const eventManager = await eventHandlers[event](presenter[eventListener], presenter, eventDelayMode(el, name));

    if (el[name]) el[name] = eventManager.listener;


    /*
        if (eventHandlers[event]) { el.addEventListener(...eventHandlers[event](eventListener, presenter)); continue; }
    
        eventHandlers["event"](addEventListener, eventListener);
    */


};

export default addEventStrategy;