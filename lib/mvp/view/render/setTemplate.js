export default function (template, callBackFn,templateName) {

    if(!template) {
         console.log(`----------- El Template ${templateName} es null--------`);
        return
     };

    const element = new DocumentFragment();
    element.appendChild(template.getHTML());

    while (element.childNodes.length > 0) {

        callBackFn(element.childNodes[0]);

    }

}