const argsFormat = (template) => {

  const clearSpaces = () => template
    .replaceAll(/(?<=\>)[\s]+(?=\<)/g, '')
    .trim();

  function directive(property) {

    let value = property
      .replaceAll(/{\s*@@\s*/g, "${meta.")
      .replaceAll(/(?<=\s*)@@\s*/g, "meta.")
      .replaceAll(/{\s*@\s*/g, "${data.")
      .replaceAll(/\s*@/g, "data.")
      .replaceAll(/{\s*#\s*/g, "${model.");

      let clearedValue = value.replace('${', "")
      .replace('}', '').trim();


    if (/\w+\s+in\s+\w+/.test(value)) value = "$"+value.replace(value, setin(clearedValue))

    if (/\w+\s+of\s+\w+/.test(value)) value = "$"+value.replace(value, setof(clearedValue))

    if (/\w+\s+as\s+\w+/.test(value)) value = "$"+value.replace(value, setas(clearedValue))

      return value;
  }

  function setin(params) {

    let [key, value] = params.split(" in ");
    if (!value.includes("data.") && !value.includes("meta.")) value = `'${value.trim()}'`;
    console.log(`{renderObject(${key},${value})}`);
    return `{renderObject(${key},${value})}`;

  }

  function setof(params) {

    let [key, value] = params.split(" of ");
    if (!value.includes("data.") && !value.includes("meta.")) value = `'${value.trim()}'`;
    return `{renderArray(${key},${value})}`;
  }

  function setas(params) {

    let [key, value] = params.split(" as ");
    if (!value.includes("data.") && !value.includes("meta.")) value = `'${value.trim()}'`;
    return `{renderFormat(${key},${value})}`;

  }

  let value = clearSpaces();
  //result = directive(result);

  const mas = value.match(/{([^}]+)}/g);

  if (mas) mas.forEach(key => value = value.replace(key, directive(key)) );

  return value;


}

export default argsFormat;

