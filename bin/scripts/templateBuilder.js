import cheerio from "cheerio";
export default function templateBuilder(el) {

  var templateObj = { template: "", tags: new Set() }

  if (el.type == "text") {
    templateObj.template = evaluateText(el.data.trim());
    return templateObj;
  }

  if (el.name === "svg") {
    const $ = cheerio.load(el);
    templateObj.template = $.html(el);
    templateObj.template = templateObj.template     
      .replaceAll("<", "'<")
      .replaceAll(">", ">'+");
    templateObj.template = templateObj.template.slice(0, templateObj.template.length - 1);
   /* templateObj.template = templateObj.template
      .replaceAll('"', '\\"')
      .replaceAll("<", '"<')
      .replaceAll(">", '>"+');
    templateObj.template = templateObj.template.slice(0, templateObj.template.length - 1);*/
    return templateObj;
  }

  if (el.type == "tag") {

    templateObj.template = `\n${el.name.toLowerCase()}()`;
    templateObj.template += propertiesBuilder(el);
    templateObj.tags.add(el.name.toLowerCase());

    concat();

  }

  function concat() {

    let children = el.children;

    if (el.children[0] && el.children[0].type == "root") { children = el.children[0].children; }

    const result = { template: [], tags: new Set() };

    children.forEach(function (child) {
      if (child.type == "text" && child.data.trim().length < 1) {
        return;
      }
      const res = templateBuilder(child);
      result.template.push(res.template);
      if (res.tags.size > 0) { result.tags = new Set([...result.tags, ...res.tags]) };

    });

    if (result.tags.size > 0) { templateObj.tags = new Set([...templateObj.tags, ...result.tags]); }
    if (result.template.length === 1) {
      templateObj.template += `\n.html(${result.template.join()})`;
    }

    if (result.template.length > 1) {
      templateObj.template += `\n.html([${result.template.join()}])`;
    }

  }

  return templateObj;
}

function evaluateText(text) {
  return `"${text.split("\n").join('"+"')}"`;
}

function propertiesBuilder(el) {
  var properties = "";

  if (el.type !== "tag") {
    return properties;
  }

  for (var property in el.attribs) {
    let strategy = property;
    if (property.endsWith("html")) {
      continue;
    }

    if (property.startsWith("data-")) {
      strategy = property.replace("data-", "");
    }

    let strategyFn = strategies[strategy];

    if (!strategyFn) {
      strategyFn = strategies.data;
    }

    properties += strategyFn(el.attribs, property);
  }

  return properties;
}

const strategies = {

  class: (attribs, property) => `.className(\"${attribs[property]}\")`,
  tabindex: (attribs, property) => `.tabIndex(\"${attribs[property]}\")`,
  data: (attribs, property) => `\n.${property}("${attribs[property]}\")`,

};
/*
function propertiesBuilder(el) {
  var properties = "";

  if (el.type !== "tag") {
    return properties;
  }

  for (var property in el.attribs) {
    let strategy = property;
    if (property.endsWith("html")) {
      continue;
    }

    if (property.startsWith("data-")) {
      strategy = property.replace("data-", "");
    }

    if (property.startsWith("data-on")) {
      strategy = "on";
    }

    let strategyFn = strategies[strategy];

    if (!strategyFn) {
      strategyFn = strategies.data;
    }

    properties += strategyFn(el.attribs, property);
  }

  return properties;
}

const strategies = {
  on: (attribs, property) => `\n.on(\"${property.replace("data-on")}\",\"${attribs[property]}\")`,
  id: (attribs, property) => `.id(\"${attribs[property]}\")`,
  href: (attribs, property) => `.href(\"${attribs[property]}\")`,
  class: (attribs, property) => `.class(\"${attribs[property]}\")`,
  type: (attribs, property) => `\n.attr(\"type\",\"${attribs[property]}\")`,
  name: (attribs, property) => `\n.attr(\"name\",\"${attribs[property]}\")`,
  tabindex: (attribs, property) => `\n.attr(\"tabindex\",\"${attribs[property]}\")`,
  binding: (attribs, property) => `\n.binding(\"${attribs[property]}\")`,
  addclass: (attribs, property) => `\n.setDataAddClass(\"${attribs[property]}\")`,
  dataValue: (attribs, property) => `\n.value(\"${attribs[property]}\")`,
  system: (attribs, property) => `\n.setSystem(\"${attribs[property]}\")`,
  dataText: (attribs, property) => `\n.text(\"${attribs[property]}\")`,
  dataId: (attribs, property) => `\n.setDataId(\"${attribs[property]}\")`,
  targetid: (attribs, property) => `\n.setDataTargetId(\"${attribs[property]}\")`,
  targetactionid: (attribs, property) => `\n.setDataTargetActionId(\"${attribs[property]}\")`,
  formatid: (attribs, property) => `\n.setDataFormatId(\"${attribs[property]}\")`,
  targetthisid: (attribs, property) => `\n.setDataTargetThisId(\"${attribs[property]}\")`,
  targettab: (attribs, property) => `\n.setDataTargetTab(\"${attribs[property]}\")`,
  tabclose: (attribs, property) => `\n.setDataTabClose(\"${attribs[property]}\")`,
  index: (attribs, property) => `\n.setDataIndex(\"${attribs[property]}\")`,
  indexparam: (attribs, property) => `\n.setDataIndexParam(\"${attribs[property]}\")`,
  indexparam: (attribs, property) => `\n.setDataIndexParam(\"${attribs[property]}\")`,
  order: (attribs, property) => `\n.setDataOrder(\"${attribs[property]}\")`,
  format: (attribs, property) => `\n.setDataFormat(\"${attribs[property]}\")`,
  entidad: (attribs, property) => `\n.setDataEntidad(\"${attribs[property]}\")`,
  table: (attribs, property) => `\n.setDataTable(\"${attribs[property]}\")`,
  tableheaders: (attribs, property) => `\n.setDataTableHeaders(\"${attribs[property]}\")`,
  tablecontent: (attribs, property) => `\n.setDataTableContent(\"${attribs[property]}\")`,
  model: (attribs, property) => `\n.model(\"${attribs[property]}\")`,
  template: (attribs, property) => `\n.template(\"${attribs[property]}\")`,
  view: (attribs, property) => `\n.setDataView(\"${attribs[property]}\")`,
  section: (attribs, property) => `\n.section(\"${attribs[property]}\")`,
  data: (attribs, property) => `\n.attr(\"${property}\",\"${attribs[property]}\")`,
};
*/