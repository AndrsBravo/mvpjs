import setData from "./setData";
import setTemplate from "./setTemplate";
const addNodesRender = async function (metaData, view, template, target, data) {

    const childNodes = [];

    const renderNewNodes = async (item) => {

        const nodes = [];

        let htmlFilled = setData(metaData, {}, item, template, view);

        let temp = HTMLLiteralToHTMLTemplate(htmlFilled);
        temp = HTMLTemplateContent(temp);

        return [item, Array.from(temp.content.childNodes)]

        /*
        while (temp.content.childNodes.length > 0) {
            Array.from
            nodes.push(temp.content.childNodes[0]);
            target.appendChild(temp.content.childNodes[0]);
        }

        //console.log([item,nodes]);
        childNodes.push( nodes);
*/
    };


    if (data instanceof Array) {

        for (const dato of data) { await renderNewNodes(dato) }

        return childNodes;
    }

    await renderNewNodes(data);

    return childNodes;

}

const updateNodesRender = async function (metaData, view, template, target, data, nodes) {

    const renderExistingNodes = async (item, node) => {



        setTemplate(template, child => {

            const newNode = node;
            newNode.parentElement.insertBefore(child, newNode);
            child.outerHTML = setData(metaData, {}, item, child.outerHTML, view);
            node.push(newNode.previousSibling);
            newNode.parentElement.removeChild(newNode);

        });

    };

    let index = 0;
    while (index < data.length) {
        await renderExistingNodes(data[index], nodes[index]);
        index++
    }

}

const globalRender = async function (metaData, view, template, target, data, nodes) {

    const removeNodeChild = async node => {

        for (const element of node) {
            element.parentElement.removeChild(element);
        }

    }

    if (data.length > nodes.length) {

        let index = Math.max(nodes.length, 0);
        //console.log("La data es mayor que el render");
        //console.log(data.slice(0, index));
        await updateNodesRender(metaData, view, template, target, data.slice(0, index), nodes);
        const adicionados = await addNodesRender(metaData, view, template, target, data.slice(index));
        //console.log("Added", adicionados);
        return adicionados;

    }

    if (data.length <= nodes.length) {
        //console.log("La data es igual o menor que el render");

        await updateNodesRender(metaData, view, template, target, data, nodes);

        while (data.length < nodes.length) {
            await removeNodeChild(nodes.pop());
        }

    }


}

export { addNodesRender, updateNodesRender, globalRender };

/**
 * 
 * @param {String} htmlLiteral 
 * @returns {HTMLTemplateElement}
 */
export function HTMLLiteralToHTMLTemplate(htmlLiteral) {

    const template = document.createElement("template");
    template.innerHTML = htmlLiteral.trim();
    return template;

}

/**
 * 
 * @param {HTMLTemplateElement} template 
 * @returns {HTMLTemplateElement}
 */
export function HTMLTemplateContent(template) {

    if (template.content.children[0] instanceof HTMLTemplateElement) return HTMLTemplateContent(template.content.children[0])
    return template;

}