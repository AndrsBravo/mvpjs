import debounceFunction from "./debounce";
import throttleFunction from "./throttle";

export default async function (eventAction, eventListener, scope, options) {

    const managed = {

        listener: (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            managed[options.mode](evt, eventListener, scope);

        },
        debounce: debounceFunction(eventAction, options.delay),
        throttle: throttleFunction(eventAction, options.delay)

    }
    return managed;

}