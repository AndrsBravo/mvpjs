function setView(view, systemaction) {

    var context = systemaction.context;
    var vw;

    if (context.view) {
        vw = views.buscar({ nombre: context.view });
    } else {
        vw = views.buscar({ nombre: view });
    }

    if (!vw) {
        return null;
    }


    var elmodelo;


    elmodelo = systemaction.data[vw.modelo];  



    if (!elmodelo) {
        return;
    }

    var filtro = eManager.filtro({ nombre: vw.modelo });


    if (filtro) {
        filtro = filtro.filtros.buscar({ current: true });
    }

    var target = null;

    if (vw.target.startsWith("tab")) {

        js.print("LLamaremos un tanb");
        js.print(vw.target);
        js.print(systemaction.data.tabs[vw.target]);
        js.print(systemaction.data.tabs);
        js.print(systemaction.data.tabs[vw.target]);

        target = document.getElementById(systemaction.data.tabs[vw.target]);



    } else {
        target = document.getElementById(vw.target);
    }


    if (!target) {
        return null;
    }


    if (vw.templateOption === "template") {
        target.innerHTML = "";
    }


    /*Si no hay registros y se ha configurado la opcion de mostrar aviso en pantalla*/
    if (context.entityaction === "load" && elmodelo.length <= 0 && vw.noRecordTeplate) {

        setData({ model: elmodelo, filtro: filtro }, target, templates.buscar({ nombre: vw.noRecordTeplate }).template, vw.templateOption);
        return;

    }

    /*Si hay registros y se ha configurado la opcion de mostrar intro de la lista*/
    //1)- Se cargara la lista intro 
    if (context.entityaction === "load" && elmodelo.length > 0 && vw.listaIntroTemplate) {

        setData({ model: elmodelo, filtro: filtro }, target, templates.buscar({ nombre: vw.listaIntroTemplate }).template, vw.templateOption);

    }

    //2)- Se cargara la lista de los datos 
    if (vw.templateOption === "target") {

        setData(elmodelo, target, "", vw.templateOption);

    } else {
        //js.print(target);
        //var plantilla = templates.buscar({nombre: vw.template}).template;
        setData(elmodelo, target, templates.buscar({ nombre: vw.template }).template, vw.templateOption);
    }

    function setData(modelo, target, plantilla, templateOption) {

        var order = 0;
        var i = 0;

        if (modelo instanceof Array) {

            target.scrollTop = 0;

            if (vw.limit && modelo.length > vw.limit) {

                var mod = modelo.slice(i, i + vw.limit);
                showData(mod);

                target.onscroll = function () {

                    if (((this.scrollTop + this.clientHeight + 10) >= this.scrollHeight) && mod.length > 0) {
                        showData(mod);
                    }
                };
            } else {
                showData(modelo);
            }

        } else {

            if (templateOption === "target") {

                setUpSystemComponent(Data(modelo));


            } else {

                var el = Data(modelo);

                if (!el.id || !document.getElementById(el.id)) {

                    target.appendChild(el);
                    setUpSystemComponent(target.lastChild);

                }


            }
        }

        function showData(mod) {

            mod.forEach(function (item) {

                if (templateOption === "target") {

                    setUpSystemComponent(Data(item));
                    order++;
                    i++;

                } else {
                    target.appendChild(Data(item));
                    setUpSystemComponent(target.lastChild);
                    order++;
                    i++;
                }
            });
        }

        function Data(item) {

            var el = templateOption === "target" ? target : getTemplate(item);

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


            var dataBinding = el.querySelectorAll("*[data-binding]");
            var dataAddClass = el.querySelectorAll("*[data-addclass]");
            var dataTargetActionId = el.querySelectorAll("*[data-targetactionid]");
            var dataTargetTab = el.querySelectorAll("*[data-targettab]");
            var dataFormatId = el.querySelectorAll("*[data-formatid]");
            var dataId = el.querySelectorAll("*[data-id]");
            var dataTargetId = el.querySelectorAll("*[data-targetid]");
            var dataTargetThisId = el.querySelectorAll("*[data-targetthisid]");
            var dataIndex = el.querySelectorAll("*[data-index]");
            var dataText = el.querySelectorAll("*[data-text]");
            var dataValue = el.querySelectorAll("*[data-value]");
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

            dataIndex.forEach(function (e) {
                setIndex(e);
            });

            dataBinding.forEach(function (e) {

                var bindings = JSON.parse(e.dataset.binding);

                if (bindings instanceof Array) {
                    bindings.forEach(binding => setBindinds(e, binding));
                }

                if (bindings instanceof Object) {
                    setBindinds(e, bindings);
                }
            });

            if (el.dataset.binding) {

                var bindings = JSON.parse(el.dataset.binding);

                if (bindings instanceof Array) {
                    bindings.forEach(binding => setBindinds(el, binding));
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
                        setData(modelo.modelo, ele, templates.buscar({ nombre: ele.dataset.template }).template, "template");
                    } else {
                        setData(modelo.modelo, ele, null, "target");
                    }
                }


            });

            if (el.dataset.modelo) {


                var modelo = eManager.modelo({ nombre: el.dataset.modelo }).modelo;
                if (modelo) {
                    if (el.dataset.template) {
                        setData(modelo, el, templates.buscar({ nombre: el.dataset.template }).template, "template");
                    } else {
                        setData(modelo, el, null, "target");
                    }
                }

            }

            if (el.dataset.entidad) {

                if (item && item[el.dataset.entidad]) {
                    if (el.dataset.template) {
                        setData(item[el.dataset.entidad], el, templates.buscar({ nombre: el.dataset.template }).template, "template");
                    } else {
                        setData(item[el.dataset.entidad], el, null, "target");
                    }
                }

            }

            dataEntidad.forEach(function (entidad) {
                if (item && item[entidad.dataset.entidad]) {
                    if (entidad.dataset.template) {
                        setData(item[entidad.dataset.entidad], entidad, templates.buscar({ nombre: entidad.dataset.template }).template, "template");
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
                            setData(data, headers, templates.buscar({ nombre: headers.dataset.template }).template, "template");
                        }
                    }

                    if (tablebody.dataset.tablecontent) {

                        if (tablebody.dataset.template) {

                            var rowtemplate = templates.buscar({ nombre: tablebody.dataset.template }).template;
                            rowtemplate = rowtemplate.getHTML();

                            if (rowtemplate.dataset.template) {

                                var columnanull = 0;
                                var i = 0;

                                while (columnanull < data.length) {

                                    rowtemplate = templates.buscar({ nombre: tablebody.dataset.template }).template;
                                    rowtemplate = rowtemplate.getHTML();

                                    columnanull = 0;

                                    data.forEach(function (columna) {

                                        if (!columna[tablebody.dataset.tablecontent] || !columna[tablebody.dataset.tablecontent][i]) {

                                            columnanull++;

                                            if (columnanull < data.length) {
                                                columna.dato = "";
                                                setData(columna, rowtemplate, templates.buscar({ nombre: rowtemplate.dataset.template }).template, "template");
                                            }

                                        } else {

                                            columna.dato = columna[tablebody.dataset.tablecontent][i];
                                            setData(columna, rowtemplate, templates.buscar({ nombre: rowtemplate.dataset.template }).template, "template");
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
                            setData(item[table.dataset.tableheader], table, templates.buscar({ nombre: table.dataset.template }).template, "template");
                        }
                        /*else {
                         setData(item[table.dataset.table], table, null, "target");
                         }*/
                    }
                }

            });

            if (el.dataset.id) {

                var propiedad = el.dataset.id.split(".");
                el.id = Dato(el, propiedad);

            }

            dataId.forEach(function (e) {

                var propiedad = e.dataset.id.split(".");
                e.id = Dato(e, propiedad);

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

            if (el.dataset.text) {

                var propiedad = el.dataset.text.split(".");
                el.innerText = Dato(el, propiedad);


            }

            dataText.forEach(function (e) {

                var propiedad = e.dataset.text.split(".");
                e.innerText = Dato(e, propiedad);


            });

            if (el.dataset.value) {

                var propiedad = el.dataset.value.split(".");
                var value = Dato(el, propiedad);
                if (value instanceof Array) {
                } else if (value === "." || value === "...") {
                } else {
                    el.value = value;
                }

            }

            dataValue.forEach(function (e) {
                var propiedad = e.dataset.value.split(".");
                var value = Dato(e, propiedad);
                if (value instanceof Array) {
                } else if (value === "." || value === "...") {
                } else {
                    e.value = value;
                }
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

                        if (typeof (data[value]) === typeof ("") || typeof (data[value]) === typeof (0)) {

                            if (e.dataset.format) {

                                data = js.format({ formatopt: e.dataset.format, value: data[value] });


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
            return el;
        }

        function evaluateIfUpdateReady(action) {

            var result = false;
            var recordBeenCurrentEdite = 0;

            if (action.activityMutation.process.length > 0) {

                action.activityMutation.process.forEach(function (pro) {

                    recordBeenCurrentEdite += Object.entries(action.data[pro]).length;

                });

            }

            result = (action.dataHasChanged === true && recordBeenCurrentEdite === 0);

            action.updateReady = result;
            action.activityMutation.change("action.updateReady", result);
            js.print(action);

        }

        function setBindinds(e, binding) {

            if (binding.evento && binding.value) {

                e.addEventListener(binding.evento, function (evt) {

                    var binding = JSON.parse(evt.currentTarget.dataset.binding);

                    var propertyPath = binding.property.split(".");
                    var data = systemaction.data;
                    var propertyCount = 0;
                    propertyPath.forEach(function (property) {

                        propertyCount++;
                        if (propertyCount === propertyPath.length) {
                            data[property] = evt.currentTarget[binding.value].replace("\n", " ");
                            systemaction.activityMutation.change(binding.property, data[property]);

                            systemaction.dataHasChanged = true;
                            systemaction.activityMutation.change("action.dataHasChanged", true);

                            evaluateIfUpdateReady(systemaction);

                            return;
                        }
                        data = data[property];

                    });
                });

            }

            if (binding.evento && binding.action) {

                e.addEventListener(binding.evento, function (evt) {

                    var binding = JSON.parse(evt.currentTarget.dataset.binding);

                    switch (binding.action) {
                        case "create":
                            binding.property.split(",").forEach((property) => {

                                systemaction.data[property] = {};

                                systemaction.activityMutation.change(property, systemaction.data[property]);

                                binding.property.split(",").forEach(function (prop) {
                                    if (systemaction.activityMutation.process.indexOf(prop) < 0) {
                                        systemaction.activityMutation.process.push(prop);
                                    }
                                });

                            });

                            break;
                        case "edit":

                            var editProperty = binding.editProperty.split(".");
                            var data = systemaction.data;
                            var propertyCount = 0;

                            editProperty.forEach(function (property) {

                                propertyCount++;
                                data = data[property];

                                if (propertyCount === editProperty.length) {

                                    if (data instanceof Array && evt.currentTarget.dataset.order) {
                                        data = data[evt.currentTarget.dataset.order];
                                        data["index"] = evt.currentTarget.dataset.order;
                                    }

                                    systemaction.data[binding.property] = js.clone(data);

                                    systemaction.activityMutation.change(binding.property, systemaction.data[binding.property]);

                                    binding.property.split(",").forEach(function (prop) {
                                        if (systemaction.activityMutation.process.indexOf(prop) < 0) {
                                            systemaction.activityMutation.process.push(prop);
                                        }
                                    });

                                    // systemaction.activityMutation.change(binding.editProperty, data);


                                    return;
                                }

                            });

                            break;
                        case "select":

                            var selectedProperty = binding.selectedProperty.split(".");
                            var data = systemaction.data;
                            var propertyCount = 0;

                            selectedProperty.forEach(function (property) {

                                propertyCount++;
                                data = data[property];

                                if (propertyCount === selectedProperty.length) {

                                    if (data instanceof Array && evt.currentTarget.dataset.order) {
                                        data = data[evt.currentTarget.dataset.order];
                                    }

                                    systemaction.activityMutation.change(binding.property, data);

                                    // systemaction.activityMutation.change(binding.selectedProperty, data);


                                    return;
                                }

                            });

                            break;
                        case "addValue":

                            var updateProperty = binding.updateProperty.split(".");
                            var data = systemaction.data;
                            var propertyCount = 0;

                            updateProperty.forEach(function (property) {

                                propertyCount++;
                                if (propertyCount === updateProperty.length) {

                                    if (!data[property]) {
                                        data[property] = [];
                                    }

                                    data[property].push(js.clone(systemaction.data[binding.property]));

                                    systemaction.data[binding.property] = {};

                                    systemaction.activityMutation.change(binding.property, systemaction.data[binding.property]);

                                    systemaction.activityMutation.change(binding.updateProperty, data[property]);

                                    systemaction.dataHasChanged = true;

                                    systemaction.activityMutation.change("action.dataHasChanged", true);

                                    return;
                                }
                                data = data[property];

                            });

                            break;
                        case "updateEdit":

                            var updateProperty = binding.updateProperty.split(".");
                            var data = systemaction.data;
                            var propertyCount = 0;

                            updateProperty.forEach(function (property) {

                                propertyCount++;
                                if (propertyCount === updateProperty.length) {

                                    if (!data[property]) {
                                        data[property] = [];
                                    }

                                    data[property].splice(systemaction.data[binding.property].index, 1, js.clone(systemaction.data[binding.property]));

                                    systemaction.data[binding.property] = {};

                                    systemaction.activityMutation.change(binding.property, systemaction.data[binding.property]);

                                    systemaction.activityMutation.change(binding.updateProperty, data[property]);

                                    return;
                                }
                                data = data[property];

                            });

                            break;
                        case "removeOrder":

                            var order = evt.currentTarget.dataset.order;

                            if (!order)
                                return;

                            var properties = binding.property.split(".");
                            var data = systemaction.data;
                            var propertyCount = 0;

                            properties.forEach(function (property) {

                                propertyCount++;
                                if (propertyCount === properties.length) {

                                    if (!data[property]) {
                                        data[property] = [];
                                    }

                                    data[property].splice(order, 1);

                                    systemaction.activityMutation.change(binding.property, data[property]);

                                    systemaction.dataHasChanged = true;

                                    systemaction.activityMutation.change("action.dataHasChanged", true);

                                    return;
                                }
                                data = data[property];

                            });

                            break;

                    }

                    evaluateIfUpdateReady(systemaction);

                    js.print(systemaction);

                });

            }
            if (binding.observe && binding.value) {

                systemaction.activityMutation.observer(binding.property, function (changes) {

                    if (binding.value === "disabled") {

                        e.disabled = (!changes);
                        return;
                    }

                    e[binding.value] = changes;

                });

            }
            if (binding.observe && binding.template) {

                systemaction.activityMutation.observer(binding.property, function (changes) {

                    // e[binding.value] = changes;
                    e.innerHTML = "";

                    if (!changes)
                        return;

                    if (Object.keys(changes).length === 0)
                        return;

                    setData(changes, e, templates.buscar({ nombre: binding.template }).template, "template");

                });

            }

        }

        function getTemplate(item) {

            if (target.dataset.viewrules == null) {
                return plantilla.getHTML();
            }
            var viewr = viewrules.buscar({ nombre: target.dataset.viewrules });
            if (viewr) {
                var el;
                viewr.rules.forEach(function (rule) {
                    if (validateTemplateRule(item, rule)) {
                        el = templates.buscar({ nombre: rule.template }).template.getHTML();

                        return;
                    }
                });
                if (el) {
                    return el;
                }
                return plantilla.getHTML();
            }

            function validateTemplateRule(item, rule) {
                switch (rule.compare) {
                    case "=":
                        return (item[rule.campo] == rule.valor);
                        break;
                }
            }
        }
    }

}