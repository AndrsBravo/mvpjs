export default function throttleFunction(callBack, delay = 1000) {
    let call = true;
    let timeOut;
    return (...args) => {

        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            call = true;
        }, delay)

        if (!call) return;
        callBack(...args);
        call = false;

    }
}