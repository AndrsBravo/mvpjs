function setData(meta, model, data, outerHTML, view) {

  function createTemplate(template, data, meta) {

    const plantilla = view.templates[template];
    let result = "";

    result += setData(meta, model, data, plantilla, view);
    return result;

  }

  function renderArray(array, template) {

    return array.map(item => createTemplate(template, item, meta)).join("");

  }

  /** renderObject on a template */
  function renderObject(object, template) {

    return createTemplate(template, object, meta);

  }

  function renderFormat(value, format) {

    if (!(format in view.format)) return value;
    return view.format[format](value);

  }

  /*
    let s = null;
    if (renderArray && renderFormat && renderObject) {
      s = "`" + outerHTML + "`";
    }  
    if (!s) return null;
  */

  //If the user wants to specify a different template 
  if (view.templateSeeking && typeof (data) != "symbol") {
    const template = view.templateSeeking(data)
    if (view.templates[template]) outerHTML = view.templates[template];
  }

  const render = Function("renderArray", "renderFormat", "renderObject", "data", `return \` ${outerHTML}  \` `)
  return render(renderArray, renderFormat, renderObject, data);
}

export default setData