export default function (outerHTML, data) {    

    while (outerHTML.indexOf("{") > -1 && outerHTML.indexOf("}") > -1) {
        

        //console.log("En el while");
        if(!data) return;
        //console.log(data);
        var property = /{([^}]+)}/.exec(outerHTML);

        //console.log(property);
        let result = dataRender(data, property[1].split("."));

        
        //console.log(result);

        if (!result) result = "";
        if (result instanceof Array) result = result.join(" ");

        outerHTML = outerHTML.replaceAll(
            property[0],
            result
        );
    }

    return outerHTML;   

}

export function pageData (outerHTML, data) {    

    while (outerHTML.indexOf("{@") > -1 && outerHTML.indexOf("}") > -1) {
        

     
        if(!data) return;
       
        var property = /{@([^}]+)}/.exec(outerHTML);

        console.log(property);
        let result = dataRender(data, property[1].split("."));

        
       

        if (!result) result = "";
        if (result instanceof Array) result = result.join(" ");

        outerHTML = outerHTML.replaceAll(
            property[0],
            result
        );
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