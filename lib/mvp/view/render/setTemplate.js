export default function (template, callBackFn) {

    if(!template) {
         console.log("----------- Este Template es null--------");
        return
     };

    const element = new DocumentFragment();
    element.appendChild(template.getHTML());

    while (element.childNodes.length > 0) {

        callBackFn(element.childNodes[0]);

    }

}