export default function routeArray(location) {
    let path = location.pathname.substring(1);
    return path ? path.split("/") : [`/`]
}
/**
 * Returns location.pathname + location.search
 * @param {*} location 
 * @returns {string}
 */
export function locationPath(location) {
    return `'${location.pathname + location.search}'`
}

function getQuery({ search }) {

    const urlSearchParams = new URLSearchParams(search);
    return Object.fromEntries(urlSearchParams.entries());

}
export function routeObject(location, routes) {

    const pathArray = routeArray(location);
    const lPath = locationPath(location)

    let route = routes;
    let property = pathArray[0];
    let path = ''

    while ('object' === typeof (route[property])) {
        route = route[property];
        property = pathArray.shift()
        path = path + "/" + property
    }

    //console.log(pathArray);
    const getPage = () => {

        if (!route[pathArray[0]]) return route.page;
        //  path = path + "/" + pathArray[0]
        return route[pathArray.shift()]
    }

    const page = getPage()

    return { path, locationPath: lPath, route, page, pathArray, query: getQuery(location) };

}