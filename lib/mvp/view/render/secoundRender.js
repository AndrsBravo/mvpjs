export default function (outerHTML, data) {


    var property = /{([^}]+)}/.exec(outerHTML);
    while (property != null) {

        //console.log("En el while");
        if (!data) return;
        //console.log(data);

        //console.log(property);
        let result = dataRender(data, property[1].split("."));

        //console.log(result);
        if (!result) result = "";
        if (result instanceof Array) result = result.join(" ");

        outerHTML = outerHTML.replaceAll(property[0], result);
        property = /{([^}]+)}/.exec(outerHTML);
    }

    return outerHTML;

}

export function pageData(outerHTML, data) {

    var property = /{@([^}]+)}/.exec(outerHTML);

    while (property != null) {

        if (!data) return;

        console.log(property);
        console.log(data);
        let result = dataRender(data, property[1].split("."));

        if (!result) result = "";

        if (result instanceof Array) result = result.join(" ");

        outerHTML = outerHTML.replaceAll(property[0], result);

        property = /{@([^}]+)}/.exec(outerHTML);
    }

    return outerHTML;

}

function dataRender(item, properties) {
    var data = item;
    //console.log(data);
    //console.log(properties);
    properties.forEach((property) => (data = data[property]));
    return data;
}