import System from "../../../core/system/System.js";
import UUID from "../../../core/utils/UUID.js";
import dataRender from "./dataRender.js";

export function renderNode(item, el) {
  for (const property in el.dataset) {
    if (
      Object.hasOwnProperty.call(el.dataset, property) &&
      dataRender[property]
    ) {
      dataRender[property](el, item);
    }
  }

  if (el.matches("a[href]")) {
    event(el);

    dataRender["href"](el, item);
  }

  var href = el.querySelectorAll("a[href]");
  var dataBind = el.querySelectorAll("*[data-bind]");
  var dataAddClass = el.querySelectorAll("*[data-addclass]");
  var dataTargetActionId = el.querySelectorAll("*[data-targetactionid]");
  var dataTargetTab = el.querySelectorAll("*[data-targettab]");
  var dataFormatId = el.querySelectorAll("*[data-formatid]");
  var dataId = el.querySelectorAll("*[data-data-id]");
  var dataTargetId = el.querySelectorAll("*[data-targetid]");
  var dataTargetThisId = el.querySelectorAll("*[data-targetthisid]");
  var dataIndex = el.querySelectorAll("*[data-index]");
  var dataText = el.querySelectorAll("*[data-data-text]");
  var dataValue = el.querySelectorAll("*[data-data-value]");
  var dataChecked = el.querySelectorAll("*[data-checked]");
  var dataModelo = el.querySelectorAll("*[data-modelo]");
  var dataEntidad = el.querySelectorAll("*[data-entidad]");
  var dataTable = el.querySelectorAll("*[data-table]");
  var dataOrder = el.querySelectorAll("*[data-order]");
  var dataModelExtend = el.querySelectorAll("*[data-modelextend]");
  // var dataActionSave = el.querySelectorAll("*[data-action=save]");
  var dataActionPrint = el.querySelectorAll("*[data-action=print]");
  var dataGraph = el.querySelectorAll("*[data-graph]");
  var dataGraphSerie = el.querySelectorAll("*[data-graph-serie]");

  if (el.matches("[data-bind]") || dataBind.length > 0) {
    const ID = UUID.get();

    if (!item["_bindId"] && !el.dataset.bindid) {
      item["_bindId"] = ID;
      el.dataset.bindid = ID;
      dataBind.forEach((el) => dataRender["bind"](el, item, ID));
    }
  }
  href.forEach((el) => {
    if (el.target) {
      return;
    }
    event(el);
    dataRender["href"](el, item);
  });
  dataText.forEach((el) => dataRender["dataText"](el, item));
  dataValue.forEach((el) => dataRender["dataValue"](el, item));
  dataId.forEach((el) => dataRender["dataId"](el, item));
}

function event(el) {
  el.addEventListener("click", (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    history.pushState({ page: history.length }, "", evt.target.href);
   
    System.routes(window.location);
  });
}

function algo() {
  if (el.dataset.order) {
    el.dataset.order = order;
  }

  if (el.dataset.tabindex === "order") {
    el.tabIndex = order + 1;
  }

  if (el.dataset.index) {
    setIndex(el);
  }

  function setIndex(el) {
    var data = "";
    var index = el.dataset.index.split(".");
    data = item;

    index.forEach(function (value) {
      if (data) {
        if (!data[value]) {
          data = index.join(".");
          return;
        }

        data = data[value];
      }
    });
    el.dataset.index = data;
  }

  dataIndex.forEach(function (e) {
    setIndex(e);
  });

  dataBinding.forEach(function (e) {
    var bindings = JSON.parse(e.dataset.binding);

    if (bindings instanceof Array) {
      bindings.forEach((binding) => setBindinds(e, binding));
    }

    if (bindings instanceof Object) {
      setBindinds(e, bindings);
    }
  });

  if (el.dataset.binding) {
    var bindings = JSON.parse(el.dataset.binding);

    if (bindings instanceof Array) {
      bindings.forEach((binding) => setBindinds(el, binding));
    }

    if (bindings instanceof Object) {
      setBindinds(el, bindings);
    }
  }

  dataModelo.forEach(function (ele) {
    var context = getContext(ele);

    eManager.setModel({ context: context }, ele.dataset.modelo);

    var modelo = eManager.modelo({ nombre: ele.dataset.modelo }).modelo;

    js.print("El modelo en el DataModelo");
    js.print(modelo);

    if (modelo) {
      if (ele.dataset.template) {
        setData(
          modelo.modelo,
          ele,
          templates.buscar({ nombre: ele.dataset.template }).template,
          "template"
        );
      } else {
        setData(modelo.modelo, ele, null, "target");
      }
    }
  });

  if (el.dataset.modelo) {
    var modelo = eManager.modelo({ nombre: el.dataset.modelo }).modelo;
    if (modelo) {
      if (el.dataset.template) {
        setData(
          modelo,
          el,
          templates.buscar({ nombre: el.dataset.template }).template,
          "template"
        );
      } else {
        setData(modelo, el, null, "target");
      }
    }
  }

  if (el.dataset.entidad) {
    if (item && item[el.dataset.entidad]) {
      if (el.dataset.template) {
        setData(
          item[el.dataset.entidad],
          el,
          templates.buscar({ nombre: el.dataset.template }).template,
          "template"
        );
      } else {
        setData(item[el.dataset.entidad], el, null, "target");
      }
    }
  }

  dataEntidad.forEach(function (entidad) {
    if (item && item[entidad.dataset.entidad]) {
      if (entidad.dataset.template) {
        setData(
          item[entidad.dataset.entidad],
          entidad,
          templates.buscar({ nombre: entidad.dataset.template }).template,
          "template"
        );
      } else {
        setData(item[entidad.dataset.entidad], entidad, null, "target");
      }
    }
  });

  if (el.dataset.table) {
    var headers = el.querySelector("[data-tableheaders]");
    var tablebody = el.querySelector("[data-tablecontent]");

    var data = item[headers.dataset.tableheaders];

    if (item && data) {
      if (headers.dataset.tableheaders) {
        if (headers.dataset.template) {
          setData(
            data,
            headers,
            templates.buscar({ nombre: headers.dataset.template }).template,
            "template"
          );
        }
      }

      if (tablebody.dataset.tablecontent) {
        if (tablebody.dataset.template) {
          var rowtemplate = templates.buscar({
            nombre: tablebody.dataset.template,
          }).template;
          rowtemplate = rowtemplate.getHTML();

          if (rowtemplate.dataset.template) {
            var columnanull = 0;
            var i = 0;

            while (columnanull < data.length) {
              rowtemplate = templates.buscar({
                nombre: tablebody.dataset.template,
              }).template;
              rowtemplate = rowtemplate.getHTML();

              columnanull = 0;

              data.forEach(function (columna) {
                if (
                  !columna[tablebody.dataset.tablecontent] ||
                  !columna[tablebody.dataset.tablecontent][i]
                ) {
                  columnanull++;

                  if (columnanull < data.length) {
                    columna.dato = "";
                    setData(
                      columna,
                      rowtemplate,
                      templates.buscar({ nombre: rowtemplate.dataset.template })
                        .template,
                      "template"
                    );
                  }
                } else {
                  columna.dato = columna[tablebody.dataset.tablecontent][i];
                  setData(
                    columna,
                    rowtemplate,
                    templates.buscar({ nombre: rowtemplate.dataset.template })
                      .template,
                    "template"
                  );
                }
              });

              i++;

              if (columnanull < data.length) {
                tablebody.appendChild(rowtemplate);
              }
            }
          }

          // setData([""], tablebody, templates.buscar({nombre: tablebody.dataset.template}).template, "template");
        }
      }
    }
  }

  dataTable.forEach(function (table) {
    if (item && item[table.dataset.table]) {
      if (table.dataset.tableheader) {
        if (table.dataset.template) {
          setData(
            item[table.dataset.tableheader],
            table,
            templates.buscar({ nombre: table.dataset.template }).template,
            "template"
          );
        }
        /*else {
                 setData(item[table.dataset.table], table, null, "target");
                 }*/
      }
    }
  });

  if (el.dataset.targetactionid) {
    var propiedad = el.dataset.targetactionid.split(".");
    el.dataset.actionid = Dato(el, propiedad);
  }

  dataTargetActionId.forEach(function (e) {
    var propiedad = e.dataset.targetactionid.split(".");
    e.dataset.actionid = Dato(e, propiedad);
  });

  if (el.dataset.targettab) {
    var propiedad = el.dataset.targettab.split(".");
    el.dataset.tab = Dato(el, propiedad);
  }

  dataTargetTab.forEach(function (e) {
    var propiedad = e.dataset.targettab.split(".");
    e.dataset.tab = Dato(e, propiedad);
  });

  if (el.dataset.formatid) {
    var propiedad = el.dataset.formatid.split(".");
    el.dataset.format = Dato(el, propiedad);
  }

  dataFormatId.forEach(function (e) {
    var propiedad = e.dataset.formatid.split(".");
    e.dataset.format = Dato(e, propiedad);
  });

  if (el.dataset.targetid) {
    var propiedad = el.dataset.targetid.split(".");
    el.dataset.target = "#" + Dato(el, propiedad);
  }

  dataTargetId.forEach(function (e) {
    var propiedad = e.dataset.targetid.split(".");
    e.dataset.target = "#" + Dato(e, propiedad);
  });

  if (el.dataset.targetthisid) {
    var propiedad = el.dataset.targetthisid.split(".");
    el.dataset.targetthis = "#" + Dato(el, propiedad);
  }

  dataTargetThisId.forEach(function (e) {
    var propiedad = e.dataset.targetthisid.split(".");
    e.dataset.targetthis = "#" + Dato(e, propiedad);
  });

  if (el.dataset.addclass) {
    var propiedad = el.dataset.addclass.split(".");

    var val = Dato(el, propiedad);

    if (val instanceof Array) {
      val.forEach(function (clase) {
        js(el).aggCls(clase);
      });
      return;
    }

    js(e).aggCls(val);
  }

  dataAddClass.forEach(function (e) {
    var propiedad = e.dataset.addclass.split(".");

    var val = Dato(e, propiedad);

    if (val instanceof Array) {
      val.forEach(function (clase) {
        js(e).aggCls(clase);
      });

      return;
    }

    js(e).aggCls(val.trim());
  });

  dataChecked.forEach(function (e) {
    var propiedad = e.dataset.checked.split(".");
    var value = Dato(e, propiedad);
    if (value instanceof Array) {
    } else if (value === "." || value === "...") {
    } else {
      e.checked = value;
    }
  });

  dataOrder.forEach(function (e) {
    e.dataset.order = order;
  });

  if (el.dataset.modelextend) {
    var mismodelos = el.dataset.modelextend.split(",");
    var modelo1 = eManager.modelo({ nombre: mismodelos[0] }).modelo;
    eManager.modelo({ nombre: mismodelos[1] }).modelo = modelo1;
  }

  dataModelExtend.forEach(function (e) {
    if (e.dataset.modelextend) {
      var mismodelos = e.dataset.modelextend.split(",");
      var modelo1 = eManager.modelo({ nombre: mismodelos[0] }).modelo;
      eManager.modelo({ nombre: mismodelos[1] }).modelo = modelo1;
    }
  });

  dataActionPrint.forEach(function (e) {
    if (e.dataset.printtarget) {
      js(e).evento("click", function () {
        window.print();
      });
    }
  });

  if (el.dataset.graph) {
    js.Graph(el);
  }

  dataGraph.forEach(function (e) {
    js.Graph(e);
  });

  if (el.dataset.graphSerie) {
    js.GraphSerie(target, el.dataset, item["analytic"]);
  }

  dataGraphSerie.forEach(function (e) {
    js.GraphSerie(target, e.dataset, item["analytic"]);
  });

  var data = "";

  return el;

  function Dato(e, propiedad) {
    data = item;

    propiedad.forEach(function (value) {
      if (data) {
        if (value === "item") {
          return item;
        }

        if (!data[value] && e.dataset.override === "true") {
          data[value] = "";
        }
        if (data[value] === undefined) {
          if (value === "claveweb" || value === "claveweb1") {
            data = "";
          } else {
            data = " ";
          }

          return;
        }
        if (data[value] === "") {
          if (value === "claveweb" || value === "claveweb1") {
            data = "";
          } else {
            data = " ";
          }

          return;
        }

        if (
          typeof data[value] === typeof "" ||
          typeof data[value] === typeof 0
        ) {
          if (e.dataset.format) {
            data = js.format({
              formatopt: e.dataset.format,
              value: data[value],
            });
          } else {
            try {
              data = data[value].trim();
            } catch (err) {
              data = data[value];
            }
          }
        } else {
          data = data[value];
        }
      }
    });
    return data;
  }
}
