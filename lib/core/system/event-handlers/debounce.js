export default function debounceFunction(callBack, delay = 1000) {
    let timeOut;
    return (...args) => {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            callBack(...args);
        }, delay);
    }
}
