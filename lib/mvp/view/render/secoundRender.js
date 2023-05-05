export default async function (outerHTML, data, view) {

    if (!data) return outerHTML;

    var property = /{([^}]+)}/.exec(outerHTML);
    // console.log("---property on secoundRender");
    // console.log(property);
    
    while (property != null) {
      

        //console.log(property);
        let result = await dataRender(data, property[1].split("."), view);

        //console.log(result);
        if (!result) result = "";
        if (result instanceof Array) result = result.join(" ");

        outerHTML = outerHTML.replaceAll(property[0], result);
        property = /{([^}]+)}/.exec(outerHTML);
    }

    return outerHTML;

}

export async function pageData(outerHTML, data, view) {

     if (!data) return outerHTML;

    var property = /{@([^}]+)}/.exec(outerHTML);

    // console.log("---property pageData");
    // console.log(property);

    while (property != null) {

        //  console.log(property);
        //  console.log(data);
        let result = await dataRender(data, property[1].split("."), view);

        if (!result) result = "";

        if (result instanceof Array) result = result.join(" ");

        outerHTML = outerHTML.replaceAll(property[0], result);

        property = /{@([^}]+)}/.exec(outerHTML);
    }

    return outerHTML;

}

async function dataRender(item, properties, view) {
    var data = item;
    //console.log(data);
    //console.log(properties);
    properties.forEach(property => {

        if (view.format && property in view.format) {
            data = view.format[property](data[property]);
            return data;
        }

        data = data[property]
    });
    return data;
}