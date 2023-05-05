import setData from "./setData";
import setTemplate from "./setTemplate";
const addNodesRender = async function (metaData, view, template, target, ladata) {

    const childNodes = [];

    const renderNewNodes = async (item) => {


        const node = [];

        /* const element = new DocumentFragment();
         element.appendChild(template.getHTML());
 
 
         while (element.childNodes.length > 0) {
 
             const child = element.childNodes[0];
             target.appendChild(child);
             child.outerHTML = setData(metaData, {}, item, child.outerHTML, view);
             node.push(target.lastChild);
 
         }*/
       
         
        setTemplate(template, child => {

            target.appendChild(child);
            child.outerHTML = setData(metaData, {}, item, child.outerHTML, view);
            node.push(target.lastChild);

        })

        childNodes.push(node);

    };


    if (ladata instanceof Array) {

        for (const dato of ladata) { await renderNewNodes(dato) }

        return childNodes;
    }

    await renderNewNodes(ladata);

    return childNodes;

}

const updateNodesRender = async function (metaData, view, template, target, data, nodes) {

    const renderExistingNodes = async (item, node) => {

        console.log(node);
       /* const element = new DocumentFragment();
        element.appendChild(template.getHTML());

        while (element.childNodes.length > 0) {

            const child = element.childNodes[0];
            const newNode = node.shift();
            newNode.parentElement.insertBefore(child, newNode);
            child.outerHTML = setData(metaData, {}, item, child.outerHTML, view.format);
            node.push(newNode.previousSibling);
            newNode.parentElement.removeChild(newNode);

        }*/

        setTemplate(template, child => {

            const newNode = node.shift();
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
        console.log("La data es mayor que el render");
        console.log(data.slice(0, index));
        await updateNodesRender(metaData, view, template, target, data.slice(0, index), nodes);
        const adicionados = await addNodesRender(metaData, view, template, target, data.slice(index));
        console.log("Addeds", adicionados);
        return adicionados;

    }

    if (data.length <= nodes.length) {
        console.log("La data es igual o menmenor que el render");

        await updateNodesRender(metaData, view, template, target, data, nodes);

        while (data.length < nodes.length) {
            await removeNodeChild(nodes.pop());
        }

    }


}

export { addNodesRender, updateNodesRender, globalRender };