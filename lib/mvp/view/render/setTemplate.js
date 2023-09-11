import { Template } from "../Template";

export default function (template, callBackFn, templateName) {

    if (!template) {
        console.log(`----------- El Template ${templateName} es null--------`);
        return
    };
   
    if(template instanceof Template){ console.log("Es una template ",template.getHTML().childNodes[0].outerHTML);  template = template.getHTML().childNodes[0].outerHTML;}

    let temp = document.createElement("template");
    temp.innerHTML = template;


    if (temp.content.childNodes[0] instanceof HTMLTemplateElement) temp = temp.content.childNodes[0];


    console.log(temp.content.childNodes)

    while (temp.content.childNodes.length > 0) {

        callBackFn(temp.content.childNodes[0]);

    }


}