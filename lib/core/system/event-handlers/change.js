import eventInterface from "./eventInterface";

export default async function (eventListener, scope, params) {

    let options = { mode: "throttle", delay: undefined, ...params };

    const eventaction = (evt, eventListener, scope) => {
        console.log("Generic Change Event has been fired");
        eventListener.apply(scope, [{value:evt.target.value ,data: evt.target.data, target:evt.target, evt}]);
    };

    return eventInterface(eventaction, eventListener, scope, options);
}