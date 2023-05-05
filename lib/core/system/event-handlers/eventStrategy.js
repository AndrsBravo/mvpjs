import eventDelayMode from "./eventDelayMode";
import eventHandlers from "./eventHandlers";
const eventStrategy = async (el, presenter) => {

    if (el.matches("a[href]")) {
        const eventManager = await eventHandlers.link(eventDelayMode(el, "onclick"));
        el.onclick = eventManager.listener;
        return;
    }
    
    for (let { name, value } of el.attributes) {

        if (!name.startsWith("on")) continue
        if (name.indexOf("debounce") > -1 || name.indexOf("throttle") > -1) continue

        let event = name.replace("on", "");

        if (event.length < 1) continue
        if (!presenter[value]) continue;

        if (event == "change" && eventHandlers.hasOwnProperty(`${el.type}${event}`)) {

            event = `${el.type}${event}`;

        }

        if (!eventHandlers.hasOwnProperty(event)) event = "event";

        const eventManager = await eventHandlers[event](presenter[value], presenter, eventDelayMode(el, name));

        if (el[name]) el[name] = eventManager.listener;

        /*
            if (eventHandlers[event]) { el.addEventListener(...eventHandlers[event](eventListener, presenter)); continue; }
        
            eventHandlers["event"](addEventListener, eventListener);
        */
    }

};

export default eventStrategy;