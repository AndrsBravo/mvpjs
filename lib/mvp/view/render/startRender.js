import secoundRender from "./secoundRender";
import {pageData} from "./secoundRender";

const startRender =  function (metaData,view, template, target, data) {

    const render = async (item) => {

        //console.log(item);

        const element = template.getHTML();

        //console.log(element);

        var dataModel = element.querySelectorAll("*[data-model]");

        for (const ele of dataModel) {

             startRender(metaData, view, view.templates()[ele.dataset.template], ele, item[ele.dataset.model])

        }

        if (element.matches("*[data-model]")) {

             startRender(metaData,view, view.templates()[element.dataset.template], element, item[element.dataset.model])

        }
       
        const outerHTML = pageData(element.outerHTML, metaData);
        target.insertAdjacentHTML("beforeend", secoundRender(outerHTML, item));


    };


    if (data instanceof Array) { data.forEach(item=>render(item)); return; }

    render(data);

    // target.insertAdjacentHTML("beforeend", secoundRender(element.outerHTML, data));




}

export default startRender;