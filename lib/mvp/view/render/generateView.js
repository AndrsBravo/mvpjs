import renderNode from "./renderNode";
import renderSys from "./renderSys";
export default function ( view,template, data) {
    const documentFragment = new DocumentFragment();

    const render = (item) => {
       /* if (item["_bindId"] && item["_bindId"].length > 0) {
            // if (this.#updateExistingNode(item)) return;
        }*/
        const newNode = renderNode(template.getHTML(), view, item);
        return newNode;
    };

    if (data instanceof Array) {
        const maped = data.map(render);
        maped.forEach(node => documentFragment.appendChild(node));
        return documentFragment;
    }

    documentFragment.appendChild(render(data))

    return documentFragment;
}
