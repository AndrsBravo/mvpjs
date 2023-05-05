import System from "../System";
import eventInterface from "./eventInterface";

export default async function (params) {

    let options = { mode: "throttle", delay: undefined, ...params };

    const eventaction = (evt) => System.route(evt.currentTarget.href);

    return eventInterface(eventaction, undefined, undefined, options);

}