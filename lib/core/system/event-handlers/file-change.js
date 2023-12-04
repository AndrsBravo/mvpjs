import eventInterface from "./eventInterface";

export default async function (eventListener, scope, params) {

    let options = { mode: "debounce", delay: undefined, ...params };

    const eventAction = (evt, eventListener, scope) => {
        console.log("File Change Event has been fired!");
        eventListener.apply(scope, [{files:evt.target.files, target:evt.target, evt}]);
    };

    return eventInterface(eventAction, eventListener, scope, options);
}