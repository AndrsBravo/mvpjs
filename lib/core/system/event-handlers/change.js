import eventInterface from "./eventInterface";

export default async function (eventListener, scope, params) {

    let options = { mode: "throttle", delay: undefined, ...params };

    const eventAction = (evt, eventListener, scope) => {

        if (evt.target.type && evt.target.type == "file")
            return eventListener.apply(scope, [{ files: evt.target.files, target: evt.target, evt }]);

        //console.log("Generic Change Event has been fired");
        eventListener.apply(scope, [{ value: evt.target.value, target: evt.target, evt }]);
        //   eventListener.apply(scope, [{ value: evt.target.value, data: evt.target.data, target: evt.target, evt }]);
    };

    return eventInterface(eventAction, eventListener, scope, options);
}