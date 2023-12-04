import eventInterface from "./eventInterface";

export default async function (eventListener, scope, params) {

    let options = { mode: "throttle", delay: undefined, ...params };

    const eventAction = (evt, eventListener, scope) => {
        eventListener.apply(scope, [{target:evt.currentTarget || evt.target, evt}]);
    };

    return eventInterface(eventAction, eventListener, scope, options);
}