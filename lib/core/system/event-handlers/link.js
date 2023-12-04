import System from "../System";
import eventInterface from "./eventInterface";

export default async function (params) {

    let options = { mode: "throttle", delay: undefined, ...params };

    const eventAction = (evt) => System.route(evt.currentTarget.href);

    return eventInterface(eventAction, undefined, undefined, options);

}