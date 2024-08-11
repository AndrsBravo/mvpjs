const argsFormat = (template) => {

  const clearSpaces = () => {
    return template
      .trim()
      .replaceAll(/\\n/g, "")
      .replaceAll(/(?<=>)[\s]+(?=<)/g, '')
      .replaceAll(/[\s]+(?=<)/g, '')
      .replaceAll(/[\s]+(?=>)/g, '')
      .replaceAll(/[\s]+(?=[/>])/g, '')
      .replaceAll(/[\s]+/g, ' ')

  }


  function directive(property) {

    let value = property
      .replaceAll(/{\s*@@\s*/g, "${meta.")
      .replaceAll(/(?<=\s*)@@\s*/g, "meta.")
      .replaceAll(/{@\s*/g, "${data.")
      .replaceAll(/@/g, "data.")
      .replaceAll(/{#\s*/g, "${model.");

    let clearedValue = value
      .replace('${', "")
      .replace('{', "")
      .replace('}', '')
      .trim();

    // console.log(clearedValue);

    if (/\w+\s+in\s+\w+/.test(value)) value = "$" + value.replace(value, setIn(clearedValue))

    if (/\w+\s+of\s+\w+/.test(value)) value = "$" + value.replace(value, setOf(clearedValue))

    if (/\w+\s+as\s+\w+/.test(value)) value = "$" + value.replace(value, setAs(clearedValue))

    return value;
  }

  function setIn(params) {
    let [key, value] = params.split(" in ");
    if (!value.includes("data.") && !value.includes("meta.")) value = `'${value.trim()}'`;
    return `{renderObject(${key},${value})}`;

  }

  function setOf(params) {

    let [key, value] = params.split(" of ");
    if (!value.includes("data.") && !value.includes("meta.")) value = `'${value.trim()}'`;
    return `{renderArray(${key},${value})}`;
  }

  function setAs(params) {

    let [key, value] = params.split(" as ");
    if (!value.includes("data.") && !value.includes("meta.")) value = `'${value.trim()}'`;
    return `{renderFormat(${key},${value})}`;

  }

  let value = clearSpaces();
  //result = directive(result);

  const mas = value.match(/{([^}]+)}/g);

  if (mas) mas.forEach(key => value = value.replace(key, directive(key)));

  return value;


}

export default argsFormat;

