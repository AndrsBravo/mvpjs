import eventInterface from "./eventInterface";

export default async function (eventListener, scope, params) {

    let options = { mode: "debounce", delay: undefined, ...params };

    const eventAction = (evt, eventListener, scope) => {
        //console.log("Generic template event has been fired");
        eventListener.apply(scope, [{ value: evt.target.value, data: evt.target.data, target: evt.currentTarget || evt.target, evt }]);
    };

    return eventInterface(eventAction, eventListener, scope, options);
}