export default function eventDelayMode(target, event) {

    let options = {};
   
    if (target.dataset.throttle) {
        options["mode"] = "throttle";
        options["delay"] = parseInt(target.dataset.throttle);
    }

    if (target.dataset.debounce) {
        options["mode"] = "debounce";
        options["delay"] = parseInt(target.dataset.debounce);
    }

    const onEventThrottle = `${event}throttle`;

    if (target.dataset[onEventThrottle]) {
        options["mode"] = "throttle";
        options["delay"] = parseInt(target.dataset[onEventThrottle]);
    }

    const onEventDebounce = `${event}debounce`;

    if (target.dataset[onEventDebounce]) {
        options["mode"] = "debounce";
        options["delay"] = parseInt(target.dataset[onEventDebounce]);
    }

  
    return options;

}