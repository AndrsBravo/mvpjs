import eventInterface from "./eventInterface";

export default async function (eventListener, scope, params) {

    let options = { mode: "throttle", delay: undefined, ...params };

    const eventAction = (evt, eventListener, scope) => {
        const formData = new FormData(evt.target);
        //Object.fromEntries(formData.entries())
        eventListener.apply(scope, [{data:Object.fromEntries(formData.entries()),formData, target:evt.target, evt}]);
    };

    return eventInterface(eventAction, eventListener, scope, options);
}