export default function templateBuilder(el) {
  var template = "";

  if (el.type == "text") {
    template = evaluateText(el.data.trim());

    return template;
  }

  if (el.type == "tag") {
    template = `\nhtml(\"${el.name.toLowerCase()}\")`;

    template += propertiesBuilder(el);

    if (el.children.length === 1) {
      var child = templateBuilder(el.children[0]);

      if (child.length > 0) {
        template += `.setHTML(\"${child}\")`;
      }

      return template;
    }

    var result = [];

    el.children.forEach(function (child) {
      if (child.type == "text") {
        return;
      }

      result.push(templateBuilder(child));
    });

    if (result.length === 1) {
      template += `\n.setHTML(${result})`;
    }

    if (result.length > 1) {
      template += `\n.setHTML([${result}])`;
    }
  }

  if (el.name === "svg") {
    template = el.outerHTML
      .replaceAll('"', '\\"')
      .replaceAll("<", '"<')
      .replaceAll(">", '>"+');
    template = template.slice(0, template.length - 1);
  }

  return template;
}

function evaluateText(text) {
  return text.split("\n").join('"+"');
}

function propertiesBuilder(el) {
  var properties = "";

  if (el.type !== "tag") {
    return properties;
  }

  for (var property in el.attribs) {
    let strategy = property;
    if (property.endsWith("systemplate")) {
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
  id: (attribs, property) => `.setId(\"${attribs[property]}\")`,
  class: (attribs, property) => `.setClass(\"${attribs[property]}\")`,
  type: (attribs, property) => `\n.setAttr(\"type\",\"${attribs[property]}\")`,
  name: (attribs, property) => `\n.setAttr(\"name\",\"${attribs[property]}\")`,
  tabindex: (attribs, property) =>
    `\n.setAttr(\"tabindex\",\"${attribs[property]}\")`,

  binding: (attribs, property) => `\n.setBinding(\"${attribs[property]}\")`,
  addclass: (attribs, property) =>
    `\n.setDataAddClass(\"${attribs[property]}\")`,
  dataValue: (attribs, property) => `\n.setValue(\"${attribs[property]}\")`,
  system: (attribs, property) => `\n.setSystem(\"${attribs[property]}\")`,
  dataText: (attribs, property) => `\n.setDataText(\"${attribs[property]}\")`,
  dataId: (attribs, property) => `\n.setDataId(\"${attribs[property]}\")`,
  targetid: (attribs, property) =>
    `\n.setDataTargetId(\"${attribs[property]}\")`,
  targetactionid: (attribs, property) =>
    `\n.setDataTargetActionId(\"${attribs[property]}\")`,
  formatid: (attribs, property) =>
    `\n.setDataFormatId(\"${attribs[property]}\")`,
  targetthisid: (attribs, property) =>
    `\n.setDataTargetThisId(\"${attribs[property]}\")`,
  targettab: (attribs, property) =>
    `\n.setDataTargetTab(\"${attribs[property]}\")`,
  tabclose: (attribs, property) =>
    `\n.setDataTabClose(\"${attribs[property]}\")`,
  index: (attribs, property) => `\n.setDataIndex(\"${attribs[property]}\")`,
  indexparam: (attribs, property) =>
    `\n.setDataIndexParam(\"${attribs[property]}\")`,
  indexparam: (attribs, property) =>
    `\n.setDataIndexParam(\"${attribs[property]}\")`,
  order: (attribs, property) => `\n.setDataOrder(\"${attribs[property]}\")`,
  format: (attribs, property) => `\n.setDataFormat(\"${attribs[property]}\")`,
  entidad: (attribs, property) => `\n.setDataEntidad(\"${attribs[property]}\")`,
  table: (attribs, property) => `\n.setDataTable(\"${attribs[property]}\")`,
  tableheaders: (attribs, property) =>
    `\n.setDataTableHeaders(\"${attribs[property]}\")`,
  tablecontent: (attribs, property) =>
    `\n.setDataTableContent(\"${attribs[property]}\")`,
  modelo: (attribs, property) => `\n.setDataModelo(\"${attribs[property]}\")`,
  template: (attribs, property) =>
    `\n.setDataTemplate(\"${attribs[property]}\")`,
  view: (attribs, property) => `\n.setDataView(\"${attribs[property]}\")`,
  section: (attribs, property) => `\n.setSection(\"${attribs[property]}\")`,
  data: (attribs, property) =>
    `\n.setAttr(\"${property}\",\"${attribs[property]}\")`,
};
