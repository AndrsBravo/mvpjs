import formatTemplate from "./render/formatTemplate";

export default class PropertyTemplateCollection {

    constructor() { }
    add(templates) {


        const formTemplate = (template) => {

            if (typeof (template) == typeof ("")) return template;

            let temp = "";

            for (let index = 0; index < template.getHTML().childNodes.length; index++) {

                temp += template.getHTML().childNodes[index].outerHTML;

            }



            return formatTemplate(temp);
        }

        const entries = Object.entries(templates);
        entries.forEach(entry => { const [key, template] = entry; this[key] = formTemplate(template) })

    }
}