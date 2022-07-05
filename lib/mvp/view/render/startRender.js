import secoundRender from "./secoundRender";
import { pageData } from "./secoundRender";

const startRender = function (metaData, view, template, target, data) {

    const render = async (item) => {

        //console.log(item);
        const element = template.getHTML();

        //console.log(element);
        var dataModel = element.querySelectorAll("*[data-model]");

        for (const ele of dataModel) {

            startRender(metaData, view, view.templates()[ele.dataset.template], ele, item[ele.dataset.model])

        }

        if (element.matches("*[data-model]")) {

            startRender(metaData, view, view.templates()[element.dataset.template], element, item[element.dataset.model])

        }

        const outerHTML = pageData(element.outerHTML, metaData);
        target.insertAdjacentHTML("beforeend", secoundRender(outerHTML, item));       

    };


    if (data instanceof Array) { data.forEach(item => render(item)); return; }

    render(data);

    // target.insertAdjacentHTML("beforeend", secoundRender(element.outerHTML, data));

}


function format() {

    var data;
    var pais = formatopts.pais;

    if (!pais) {
        return obj.value;
    }



    return {


        percent: () => {
            var option = { style: "percent" };
            var number = new Number(obj.value);
            if (number > 0) {
                number = number / 100;
            }
            data = number.toLocaleString(pais.lang, option);
            return data;
        },
        numeric: () => {
            var number = new Number(obj.value);
            // var number = new Intl.NumberFormat('en-US', {minimunFractionDigits: 2});               
            data = number.toLocaleString('en-US');
            // data = number.format(obj.value);

            return data;
        },
        decimal: () => {
            var number = new Number(obj.value);
            // var number = new Intl.NumberFormat('en-US', {minimunFractionDigits: 2});               
            data = number.toLocaleString('en-US', { style: "currency", currency: "RDO" }).replace("RDO", "");
            // data = number.format(obj.value);

            return data;
        },
        currency: () => {
            var option = { style: "currency", currency: pais.currency };
            var number = new Number(obj.value);
            data = number.toLocaleString(pais.lang, option);
            return data;
        },
        date: () => {
            var option = { year: "numeric", month: "numeric", day: "numeric" };
            var date = new Date(obj.value.trim());
            data = date.toLocaleDateString(pais.lang, option);
            return data;
        },
        uppercase: () => {
            data = obj.value.toUpperCase();
            return data;
        },
        lowercase: () => {
            data = obj.value.toLowerCase();
            return data;
        },
        storage: () => {

            let b = 1024;
            let kb = b * 1024;
            let mb = kb * 1024;
            let gb = mb * 1024;
            let tb = gb * 1024;
            let pb = tb * 1024;
            let eb = pb * 1024;
            let zb = eb * 1024;
            let yb = zb * 1024;

            const medidas = { yb, zb, eb, pb, tb, gb, mb, kb, b };

            for (const property in medidas) {

                const value = medidas[property];
                // console.log(property, value)
                if (value > size) continue;

                data = `${(size / value).toFixed(2)} ${property.toUpperCase()}`;
                break;
            }

            return data;
        },

        default: () => {
            data = obj.value;
            return data;
        },

    }


};


export default startRender;