import setData from "./setData";

const updateRender = async function (metaData, view, template, target, data, nodes) {

    const render = async (item, node) => {

        const element = new DocumentFragment();
        element.appendChild(template.getHTML());

        while (element.childNodes.length > 0) {

            const child = element.childNodes[0];
            const newNode = node.shift();
            newNode.parentElement.insertBefore(child, newNode);
            child.outerHTML = setData(metaData, {}, item, child.outerHTML, view.format);
            node.push(newNode.previousSibling);
            newNode.parentElement.removeChild(newNode);

        }

    };

    if (!(data instanceof Array)) { await render(data, nodes[0]); return; }

    for (let index = 0; index < data.length; index++) {
        await render(data[index], nodes[index])
    }

}


const startRender = async function (metaData, view, template, target, laData) {

    const childNodes = [];

    const render = async (item) => {

        const element = new DocumentFragment();
        element.appendChild(template.getHTML());

        while (element.childNodes.length > 0) {

            const child = element.childNodes[0];
            target.appendChild(child);
            child.outerHTML = setData(metaData, {}, item, child.outerHTML, view.format);
            childNodes.push(target.lastChild);

        }

    };


    if (laData instanceof Array) {

        for (const dato of laData) { await render(dato) }

        return childNodes;
    }

    await render(laData);

    return childNodes;

}

export default updateRender;