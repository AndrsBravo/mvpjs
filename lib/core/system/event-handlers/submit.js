import eventInterface from "./eventInterface";

export default async function (eventListener, scope, params) {

    let options = { mode: "throttle", delay: undefined, ...params };

    const eventAction = (evt, eventListener, scope) => {
        //console.log("-------En el submit-----------");
        //console.log();

        const form = evt.currentTarget.tagName === "FORM" ? evt.currentTarget : evt.target;
        //console.log({ form });

        const formData = new FormData(form);
        eventListener.apply(scope, [{ data: Object.fromEntries(formData.entries()), formData, target: form, evt }]);
    };

    return eventInterface(eventAction, eventListener, scope, options);
}