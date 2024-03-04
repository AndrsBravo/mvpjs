export default function ssRender(data, html, view) {

  function createTemplate(template, data) {

    const plantilla = view.templates[template];
    let result = "";

    result += ssRender(data, plantilla, view);
    return result;

  }

  function renderArray(array, template) {

    return array.map(item => createTemplate(template, item)).join("");

  }

  /** renderObject on a template */
  function renderObject(object, template) {

    return createTemplate(template, object);

  }

  function renderFormat(value, format) {

    if (!(format in view.format)) return value;
    return view.format[format](value);

  }

  return Function("renderArray", "renderFormat", "renderObject", "data", `return \`${html}\``)
    (renderArray, renderFormat, renderObject, data);

}