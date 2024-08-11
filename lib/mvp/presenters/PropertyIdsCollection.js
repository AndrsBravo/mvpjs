import eventDelayMode from "../../core/system/event-handlers/eventDelayMode";
import eventHandlers from "../../core/system/event-handlers/eventHandlers";

export default class PropertyIdsCollection {
  #scope;

  constructor(scope) { this.#scope = scope; }

  add(id) {
    id.scope = this.#scope;
    this[id.id] = this.#proxy(id);
  }

  #proxy(object) {

    const handler = {

      get(target, prop) {

        if (prop == "select") {

          if (target[prop]) target[prop]()

          return () => target.classList.add("selected")
        };

        if (prop == "discard") return () => target.classList.remove("selected");

        if (!(prop in target)) return;

        if (prop == "addEventListener") {

          const method = target.addEventListener;

          return async (...args) => {

            const eventName = args.shift();
            const eventListener = args.shift();

            if (!eventName) return;
            if (!eventListener) return;

            const eventHandler = await this.handler(target, eventName, eventListener);

            if (!eventHandler) return;
            method.apply(target, [eventName, eventHandler.listener]);
          }

        }

        if (typeof (target[prop]) == "function" && !prop.startsWith("on")) return (param) => target[prop].call(target, [param]);

        return target[prop];

      },

      async set(target, prop, value) {

        if (prop == "id") throw `Changing '${prop}' attribute at this context is not allowed!`;

        if (prop.indexOf("debounce") > -1 || prop.indexOf("throttle") > -1) {
          target.dataset[prop] = value;
          return true;
        }

        if (prop.startsWith("on")) {
          if (!prop in target) throw `${target.tagName} does not have ${prop} event`;

          const eventHandler = await this.handler(target, prop.replace("on", ""), value);
          target[prop] = eventHandler.listener;

          return true;
        }

        target[prop] = value;

        return true;

      },

      async handler(target, eventName, eventListener) {

        let event = "event";
        if (eventHandlers.hasOwnProperty(eventName)) event = eventName;
        const eventManager = await eventHandlers[event](eventListener, object.scope, eventDelayMode(target, `on${eventName}`));
        return eventManager;

      }

    }

    return new Proxy(object.element, handler);
  }

}