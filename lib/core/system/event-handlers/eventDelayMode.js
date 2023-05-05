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

    const oneventthrottle = `${event}throttle`;

    if (target.dataset[oneventthrottle]) {
        options["mode"] = "throttle";
        options["delay"] = parseInt(target.dataset[oneventthrottle]);
    }

    const oneventdebounce = `${event}debounce`;

    if (target.dataset[oneventdebounce]) {
        options["mode"] = "debounce";
        options["delay"] = parseInt(target.dataset[oneventdebounce]);
    }

  
    return options;

}