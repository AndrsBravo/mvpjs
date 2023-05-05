import setTemplate from "./setTemplate";

export default function setData(meta, model, data, outerHTML, view) {

  function createTemplate(template, data, meta) {
   
    const plantilla = view.templates[template];
    let result = "";

    setTemplate(plantilla, child => {

      result += setData(meta, model, data, child.outerHTML, view);
      const fragment = new DocumentFragment();
      fragment.append(child);

    });

    return result;

  }

  function renderArray(array, template) {

    return array.map(item => createTemplate(template, item, meta)).join("");

  }

  function renderObject(object, template) {

    return createTemplate(template, object, meta);

  }

  function renderFormat(value, format) {

    if (!(format in view.format)) return value;
    return view.format[format](value);

  }

  return eval("`" + outerHTML + "`");
}