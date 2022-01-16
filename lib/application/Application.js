"use strict";

// <editor-fold  defaultstate="collapsed" desc="Application">

function Application() {

    var wsApp;
    var eManager;
    var system = new System(SystemActionListener);
    var templates = [];
    var views = [];
    var viewspath = [];
    var viewrules = [];
    var controladores = [];
    var controlleractions = [];
    var tabactions = [];
    var currentController = [];
    var paises = {};
    var notificationHandler;
    var settings = {};
    var navigation = [];
    var currentpanel;
    var testTimer = 0;

    this.start = function () {
        // system.action("splash", {targetclose: "#screen_inicio"}, 9000);
        system.sesion.setSesionStateChanged(sesionStateChanged);
        start();
    };

    function sesionStateChanged(obj) {

        if (obj !== null && obj.sesion !== undefined) {
            switch (obj.sesion) {
                case "off":

                    js.GraphReset();
                    js.print("------- Klk waw waw waw la sesion praaaaaaaaa se quito ");
                    system.action("login", getContext({ action: "save", entityaction: "logout", failcontext: "login" }));

                    break;
            }
        }
    }

    function start() {

        var pais = paises.buscar({ pais: "RDO" });
        if (!pais) {
            pais = paises.buscar({ pais: "DEF" });
        }
        js.fortmatOptions({ pais: pais });

        var time = 5000;
        /* setTimeout(start, time);
         wsApp.wsTest(time);
         system.sesion.sesionTest();*/

    }

    this.webSocketApp = function (sett) {

        wsApp = new WebSocketApplication({ url: sett });
        wsApp.setMessageHandler(wsAppMessage);
        wsApp.setReadyStateNotificationHandler(wsAppreadyStateNotification);
        wsApp.wsOpen();

    };
    this.Templates = function (obj) {
        templates = obj;
    };
    this.ViewsPath = function (obj) {
        viewspath = obj;
    };
    this.Entities = function (obj) {
        eManager = new EntityManager();
        eManager.setEntityConfig(obj);
        eManager.setEntityListener(EntityActionListener);
        eManager.setNotificationListener(notify);
        eManager.setEntityStateChangeListener(EntityChangeListener);
    };
    this.Filtros = function (obj) {
        eManager.setEntityFiltros(obj);
    };
    this.Contexts = function (obj) {
        eManager.setModelContext(obj);
    };
    this.Views = function (obj) {
        views = obj;
    };
    this.ViewRules = function (obj) {
        viewrules = obj;
    };
    this.Models = function (obj) {
        eManager.setModelConfig(obj);
    };
    this.Controllers = function (obj) {
        controladores = obj;
    };

    this.ControllerActions = function (obj) {
        controlleractions = obj;
    };

    this.TabActions = function (obj) {
        tabactions = obj;
    };

    this.ModelsRules = function (obj) {
        eManager.setModelRules(obj);
    };

    this.Paises = function (obj) {
        paises = obj;
    };

    this.setNotificationHandler = function (nh) {
        notificationHandler = nh;
    };

    this.popCurrentController = function () {
        currentController.pop();
        //js.print(currentController.length);
    };
    this.hide = function () {
        if (system.sesion.hasEstado()) {
            var paquete = getPaquete(system.sesion.getEstadoPaquete());
            paquete.tipo = 70;
            wsApp.Enviar(paquete);
        }
        //js.print("Ahora el hide esta en la clase");
    };

    function url() {
        var config = settings.application.config;
        if (settings.application.config) {
            return config.protocolo + "://" + config.ip + ":" + config.puerto + "/BITCloudService-Clientemovil/BITWSSEP";
        }
    }

    function setNavigation(panel) {
        //js.print("El indice");
        if (navigation.indexOf(panel) === -1) {
            navigation.push(panel);
            currentpanel = navigation.length - 1;
            //js.print(navigation);
            //js.print(currentpanel);
            return;
        }
        var o = navigation.indexOf(panel);
        navigation.splice(o, 1);
        navigation.push(panel);
        currentpanel = navigation.length - 1;
        //js.print(navigation);
        //js.print(currentpanel);
    }

    function setConfig() {
        /* if (entidades.Parametrogenerico) {
         //  entidades.Parametrogenerico["SIMBOLO_MONEDA_NACIONAL"] = entidades.Parametrogenerico.buscar({parametro: "SIMBOLO_MONEDA_NACIONAL"}).valor;
         }*/
    }

    function getPaquete(request) {
        var paquete = {};
        paquete.accion = "data";
        paquete.header = settings.connection;
        paquete.info = { id: request.id, action: request.type, entidad: request.entidad, data: request.modelo, filtro: request.filtro.filtro, parametro: request.parametro };
        return paquete;
    }

    function EntityActionListener(appaction, EntityAction) {
        var paquete = getPaquete(EntityAction);
        paquete.tipo = 70;
        appaction.wait = true;
        js.print("5- Se realizara una peticion remota");
        js.print(paquete);
        testTimer = 100000;
        wsApp.Enviar(paquete);
    }

    function EntityChangeListener(EntityChanged) {

        js.print("Modificada EntityChanged");
        js.print(EntityChanged);
        var action = system.get({ id: EntityChanged.id });
        js.print("Original action");
        js.print(action);

        /* if (action.controller === "config") {
         var codpais = eManager.entidad({nombre: "parametrogenericos"}).data.buscar({parametro: "CODIGO_PAIS"}).valor;
         var pais = paises.buscar({pais: "RDO"});
         if (!pais) {
         pais = paises.buscar({pais: "DEF"});
         }
         js.fortmatOptions({pais: pais});
         }*/
        js.print("6- Se recupera la action que provoco la consulta a base de datos");
        js.print(action);

        if (EntityChanged.context) {
            for (var campo in EntityChanged.context) {
                action.context[campo] = EntityChanged.context[campo];
            }
        }

        action.wait = false;

        js.print("7- Se modifica con el context de la EntityChanged y ya no espera");
        js.print(action);


        system.checkAction(action);
        //  proceso({id: EntityChanged.id, tipo: 2});
    }

    function SystemActionListener(systemaction) {

        js.print("3- Se lanza La action que ");
        js.print(systemaction);


        // Settings tab

        setAppTabs(systemaction);

        systemaction.controllers.forEach(function (controlador) {

            eManager.setModel(systemaction, controlador);

            //Se formatea la vista correspondiente al controlador
            //(Las vistas podran ser mas de una(1) para un(1) controlador)
            controlador.view.split(",").forEach(function (view) {
                setView(view, systemaction);
            });

            //Se colocan las acciones del toolbar si corresponden
            //setControllerAction(controlador, systemaction.context);

            js.print("---El modelo se puede ejecutar-----");
            //setFilters(controlador);


            //  system.checkAction(systemaction);


            //Si el controlador ejecuta una action primaria (), lo colocamos como estado de la sesion
            if (controlador.performState && systemaction.context.controller !== "filterAction" && controlador.currentAction !== undefined) {
                system.sesion.setEstado(systemaction, controlador.currentAction);
            }

        });

    }

    function wsAppreadyStateNotification(obj) {
        switch (obj.tipo) {
            case "open":
                wsApp.Enviar({ tipo: 99, header: settings.connection });
                break;
            case "close":
                wsApp.wsOpen();
                system.sesion.setEstatus({ tipo: 97, estatus: "Desconectado" });
                break;
            case "wsTest":
                wsApp.Enviar({ tipo: 100, header: settings.connection });
                break;
        }
    }

    function wsAppMessage(obj) {

        js.print(obj);

        if (!obj) {
            return null;
        }

        var action = system.get({ id: obj.id });

        switch (obj.tipo) {

            // Recuperando el Estado de la sesion guardado
            case 0:

                js.print("Me llego el cero");


                break;

            // Recuperando el Estado de la sesion guardado
            case 1:

                system.sesion.setEstado(obj.data);

                break;

            // Recuperando el config del usuario.
            case 10:

                eManager.setEntity(obj);
                notify({ tipo: "inf", texto: "Espere " /*+ obj.id*/ });
                system.sesion.setEstadoGuardado();

                break;

            //Gestion de estado de servicio//
            //Servicio normal, vencido
            //Aqui se mostrara un mensaje al cliente de estatus vencido, app temporalmente fuera de servicio, debido al pago u otras razones.
            case 20:
                break;

            //Servicio normal, Proximo a vencer
            //Aqui se mostrara un mensaje al cliente de estatus proximo a vencer, app temporalmente fuera de servicio, debido al pago u otras razones.
            case 20.1:
                break;

            case 20.2:
                break;

            case 20.3:
                break;

            //Servicio evaluacion, vencido
            //Aqui se mostrara un mensaje al cliente de estatus vencido, app temporalmente fuera de servicio, debido al vencimiento del periodo de pruebas.
            case 20.5:
                break;

            //Servicio evaluacion, Proximo a vencer
            //Aqui se mostrara un mensaje al cliente de estatus proximo a vencer, app temporalmente fuera de servicio, debido al vencimiento del periodo de pruebas.
            case 20.6:
                break;

            //Sesion por configurar
            case 50:


            //Sesion abierta y conectada
            case 51:
                //Se cargan los datos
                js.print("Llega el 51");
                //  var action = system.get({id: obj.id});
                action.complete = true;
                action.wait = false;
                action.success = true;
                system.sesionStart();
                eManager.setEntity(obj);
                if (obj.dato !== undefined) {
                    system.sesion.setEstado(obj.dato, null);
                }
                notify({ tipo: "inf", texto: obj.datos[0] });
                //   system.checkAction(action);
                //  eManager.loadDefaultEntities();
                break;

            //Sesion cerrada esperando conexion
            case 52:
                js.print("Llega el 52");
                action.complete = true;
                action.wait = false;
                action.success = false;
                notify({ tipo: "err", texto: obj.dato });
                js.GraphReset();

                // system.checkAction(action);
                eManager.setEntity(obj);
                /* riseController("login");*/
                break;
            //Sesion por configurar
            case 53:
                js.print("Llega el 53");
                eManager.setEntity(obj);
                system.action("configuser", { entityaction: "load", filter: "order", order: 0 });
                break;
            case 71:
                //Respuesta de info consultada
                eManager.setEntity(obj);
                notify({ tipo: "inf", texto: "Espere.. " /*+ obj.id*/ });
                //  proceso({id: obj.id, tipo: 2, respuesta: obj.tipo, data: obj.data});
                break;
            case 71.1:
                //Actualizacion de datos exitosa!
                action.complete = true;
                action.wait = false;
                action.success = true;
                eManager.setEntity(obj);
                notify({ tipo: "inf", texto: obj.dato });
                break;
            case 71.2:
                //Los datos no se actualizaron conrrectamente
                notify({ tipo: "adv", texto: obj.dato });
                action.complete = true;
                action.wait = false;
                action.success = false;
                system.checkAction(action);
                break;
            case 71.5:
                //Correo enviado correctamente
                notify({ tipo: "inf", texto: obj.dato });
                action.complete = true;
                action.wait = false;
                //action.success = false;
                system.checkAction(action);
                break;
            case 71.6:
                //Correo enviado correctamente
                notify({ tipo: "adv", texto: obj.dato });
                action.complete = true;
                action.wait = false;
                //action.success = false;
                system.checkAction(action);
                break;
            case 71.7:
                //Uploading files
                //notify({tipo: "adv", texto: obj.dato});
                //action.complete = true;
                //action.wait = false;
                //action.success = false;
                system.checkAction(action);
                break;
            case 71.8:

                js.print("La respuesta de 71.8");
                js.print(obj);
                js.print(action);
                eManager.setEntity(obj);


                //Uploading files
                //notify({tipo: "adv", texto: obj.dato});
                //action.complete = true;
                //action.wait = false;
                //action.success = false;
                //system.checkAction(action);
                break;
            case 71.9:

                js.print("La respuesta de 71.9");
                js.print(obj);
                js.print(action);
                eManager.setEntity(obj);

                break;
            case 97.1:
                //Error de conexion porque el server no erba disponible
                system.sesion.setEstatus({ tipo: 97.1, estatus: "Desconectado" });
                notify({ tipo: "err", texto: obj.data });
                break;
            case 97.2:
                //Error de conexion porque el cliente pc no estaba disponible
                system.sesion.setEstatus({ tipo: 97.2, estatus: "Desconectado" });
                notify({ tipo: "err", texto: obj.data });
                break;
            case 97.3:
                //Error de conexion porque el cliente movil no estaba disponible
                system.sesion.setEstatus({ tipo: 97.3, estatus: "Desconectado" });
                notify({ tipo: "err", texto: obj.data });
                break;
            case 98:

                //La conexion se realizo exitosamente
                system.action("login", getContext({ entityaction: "load", filter: "order", order: 0, successcontext: "config,pedidos_resume,facturas_resume,pedidos_acumulado,facturas_acumulado,pagos_acumulado,devoluciones_acumulado", target: "#popuplogin", targetclose: "#screen_inicio" }));

                /*   var proc = {id: js.id(), tipo: 1, paquete: getPaquete("login", {action: "login", entidad: "usuario"})};
                 proceso(proc);*/
                system.sesion.setEstatus({ tipo: 98, estatus: "Conectado" });
                notify({ tipo: "inf", texto: "Conectado" });

                break;
            case 100:

                //La conexion se interrumpio de forma repentina
                system.sesion.setEstatus({ tipo: 100, estatus: "Desconectado" });
                notify({ tipo: "err", texto: obj.data });

                break;
            case 101:

                notify({ tipo: "inf", texto: obj.data });

                js.print("----Llega el 101");
                //system.sesion.setEstatus({tipo: 101, estatus: "Conectado"});

                break;

            default:
                break;
        }
    }

    function setAppTabs(systemaction) {

        /*Generate tabs info if tab is not generated yet*/
        var actioncontext = systemaction.context;

        //Si no hay tab para configurar se interrumpe este proceso

        if (!actioncontext.tab) {
            return;
        }

        /*La tab actual solicitada*/
        /*Es necesario validar si se ha creado ya*/
        var tab = actioncontext.tab;

        var latab = eManager.getEntity({ entidad: "tabs", param: { nombre: tab } });

        js.print("La tab");
        js.print(latab);

        /*Si la tab existe se adiciona al modelo*/
        if (!latab) {

            /*Si la tab no existe se crea y se adiciona al modelo y ala entidad*/

            if (actioncontext.tabvariable) {
                tab = tab + "_" + systemaction.id;
                js.print("++-++-+-+---+--+--+ tabvariable");
                js.print(tab);
            }

            var latab = {

                nombre: tab,
                title: tab.replaceAll("_", " "),
                tabheader: tab + "_header",
                tabbody: tab + "_body",
                tabcontent: tab + "_content",
                tabtoolbar: tab + "_toolbar",
                tabplaceholder: tab + "_placeholder",
                tabfooter: tab + "_footer",
                tabright: tab + "_right"

            };

            systemaction.tab = latab.nombre;

            eManager.pushDataOnEntity({ entidad: "tabs", data: latab });



        }

    }

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

        /* var tab;
         if (context.tab) {
         
         js.print("-----++++++----++++++-----++++++------+++El dato del modelo y " + vw.target);
         var Tabs = eManager.entidad({nombre: "tabs"}).data;
         var tab = Tabs.buscar({nombre: context.tab});
         }*/

        elmodelo = systemaction.data[vw.modelo];

        // js.print("-----++++++----++++++-----++++++------+++El dato del modelo y " + vw.target);
        // js.print(systemaction.data);
        // js.print(elmodelo);



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

    function setControllers(controladores, el, evt) {

        if (controladores.length < 1) {
            return null;
        }

        if (!el) {
            return null;
        }

        var call = true;

        if (controladores.performEnterKey) {
            if (evt.key !== "Enter") {
                call = false;
            }
        }

        if (call) {

            system.action(controladores, getContext(evt));
        }

        function validarPermiso(controladores) {

            controladores.forEach(function (controlador) {

                if (!controlador.permiso) {
                    return true;
                }

                var result = false;

                var usuario = eManager.entidad({ nombre: "usuario" }).data[0];
                usuario.permisos.forEach(function (permiso) {
                    if (permiso.opcion.opcion === controlador.permiso) {
                        result = true;
                    }
                });

                if (!result) {
                    notify({ tipo: "adv", texto: "El usuario no tiene permisos para ejecutar esta accion" });
                }

                return result;

            });
        }
    }

    function setControllerAction(controller, context) {

        var contActions = controlleractions.buscar({ controller: controller.nombre });

        if (contActions) {

            var actions = contActions.actions;
            var bodybar = document.getElementById(contActions.actionpanel);

            var toolbar = document.getElementById(contActions.actionbar);

            if (contActions.actionbar === "tabtoolbar") {
                toolbar = document.getElementById(context.tab + "_toolbar");
            }


            var extendedbar = document.getElementById(contActions.extendedBar);
            var extendbutton;

            if (contActions.extendButton) {
                extendbutton = templates.buscar({ nombre: contActions.extendButton });
            }

            if (toolbar)
                while (toolbar.firstChild) {
                    toolbar.removeChild(toolbar.firstChild);
                }

            // toolbar.clear .innerHTML = "";
            if (bodybar) {

                while (bodybar.firstChild) {
                    bodybar.removeChild(bodybar.firstChild);
                }

            }

            if (extendedbar) {

                while (extendedbar.firstChild) {
                    extendedbar.removeChild(extendedbar.firstChild);
                }

            }

            actions.forEach(function (action) {

                switch (action.type) {
                    case "body":

                        var actionTemplate = templates.buscar({ nombre: action.action });
                        if (actionTemplate) {
                            var el = actionTemplate.template.getHTML();
                            setUpSystemComponent(el);
                            bodybar.appendChild(el);
                        }
                        break;
                    case "tool":
                        var actionTemplate = templates.buscar({ nombre: action.action });
                        if (actionTemplate) {
                            var el = actionTemplate.template.getHTML();
                            setUpSystemComponent(el);
                            if (contActions.extendWhen && contActions.extendWhen == toolbar.childElementCount) {
                                var exb = extendbutton.template.getHTML();
                                setUpSystemComponent(exb);
                                toolbar.insertBefore(exb, toolbar.firstChild);
                                extendedbar.appendChild(el);
                            } else if (contActions.extendWhen && contActions.extendWhen < toolbar.childElementCount) {
                                extendedbar.appendChild(el);
                            } else {
                                toolbar.appendChild(el);
                            }
                        }
                        break;
                }

            });

        }
    }

    function setTabAction(context) {

        var tabActions = tabactions.buscar({ tab: context });

        var action_container = document.getElementById("action_container");
        var sub_menu_action = document.getElementById("sub_menu_action");
        var menu_action = document.getElementById("menu_action");

        if (action_container)
            while (action_container.firstChild) {
                action_container.removeChild(action_container.firstChild);
            }

        if (sub_menu_action)
            while (sub_menu_action.firstChild) {
                sub_menu_action.removeChild(sub_menu_action.firstChild);
            }


        if (menu_action) {

            while (menu_action.firstChild) {
                menu_action.removeChild(menu_action.firstChild);
            }

        }

        if (tabActions) {

            var actions = tabActions.actions;


            actions.forEach(function (action) {

                switch (action.type) {
                    case "menu_action":

                        var actionTemplate = templates.buscar({ nombre: action.action });
                        if (actionTemplate) {
                            var el = actionTemplate.template.getHTML();
                            setUpSystemComponent(el);
                            menu_action.appendChild(el);
                        }
                        break;
                    case "tool":
                        var actionTemplate = templates.buscar({ nombre: action.action });
                        if (actionTemplate) {
                            var el = actionTemplate.template.getHTML();
                            setUpApplicationComponent(el);
                            if (tabActions.extendWhen && tabActions.extendWhen == toolbar.childElementCount) {
                                var exb = extendbutton.template.getHTML();
                                setUpApplicationComponent(exb);
                                toolbar.insertBefore(exb, toolbar.firstChild);
                                extendedbar.appendChild(el);
                            } else if (tabActions.extendWhen && tabActions.extendWhen < toolbar.childElementCount) {
                                extendedbar.appendChild(el);
                            } else {
                                toolbar.appendChild(el);
                            }
                        }
                        break;
                }

            });

        }
    }

    function setFilters(controller) {

        //Si el controlador no ejecuta filtros, no se configuran
        if (!controller.setfilters) {
            return;
        }
        var filtro = eManager.filtro({ nombre: controller.model });
        if (filtro) {
            var filterlist = document.getElementById("lista_filtros");
            filterlist.innerHTML = "";
            var filterTemplate = templates.buscar({ nombre: "filterList" });
            filtro.filtros.forEach(function (fil) {
                var el = filterTemplate.template.getHTML();
                el.innerText = fil.title;
                el.dataset.controller = controller.nombre;
                el.dataset.filter = fil.filtro;
                js(el).aggCls("filterList");

                if (fil.current) {
                    js(el).VerOcultar();
                }
                setUpSystemComponent(el);
                filterlist.appendChild(el);
            });
        }
    }

    function getContext(obj) {

        var target = obj;

        if (obj instanceof Event) {

            target = obj.currentTarget;

        }

        var newObjContext = {};

        if (target instanceof HTMLElement) {

            for (var it in target.dataset) {
                newObjContext[it] = target.dataset[it];
            }

            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {

                if (target.type && target.type === "checkbox") {
                    newObjContext.datavalue = target.checked;
                } else if (target.type && target.type === "file") {

                    // newObjContext.data["files"] = [];

                    //  target.files.forEach((file) => newObjContext.data["files"].push(file));

                    js.print("Llega el file");
                    js.print(target);

                    newObjContext.datavalue = target.files;

                } else {

                    newObjContext["datavalue"] = target.value;
                }
            }

            if (target.dataset.actionid) {
                newObjContext["actionid"] = target.dataset.actionid;
            }

            if (target.dataset.system === "drop") {

                var inputFile = target.querySelector("input[type=file]");

                newObjContext["datavalue"] = [];
                obj.dataTransfer.files.forEach((file) => {

                    if (!inputFile) {
                        newObjContext["datavalue"].push(file);
                        return;
                    }

                    if (inputFile.accept) {

                        inputFile.accept.split(",").forEach((extencion) => {

                            if (file.name.endsWith(extencion)) {
                                newObjContext["datavalue"].push(file);
                            }
                        });

                    }

                }

                );

            }



        } else {
            newObjContext = obj;
        }

        if (newObjContext.failcontext) {
            newObjContext.failcontext = eManager.getContext({ nombre: newObjContext.failcontext });
        }

        if (newObjContext.successcontext) {
            var succes = [];
            newObjContext.successcontext.split(",").forEach(function (sus) {
                succes[succes.length] = eManager.getContext({ nombre: sus });
            });
            newObjContext.successcontext = succes;

        }

        return newObjContext;
    }

    function notify(obj) {
        if (notificationHandler !== undefined) {
            notificationHandler(obj);
        }
    }

    function test() {
        setTimeout(function () {
            print("Se lanza el test");
        }, testTimer);
    }

    function setUpApplicationComponent(evt) {

        let el;

        if (evt instanceof Event)
            el = evt.currentTarget;

        if (evt instanceof HTMLElement)
            el = evt;



        if (el.dataset.alert) {

            window.alert("Este mensaje es para probar la funcion click de estecomponente");

        }

        if (el.dataset.actionleft) {

            js(el.dataset.actionleft).Moveleft();

        }

        if (el.dataset.actionright) {

            js(el.dataset.actionright).Moveright();

        }

        if (el.dataset.targetclose) {

            el.dataset.targetclose.split(",").forEach(function (e) {
                js(e).Ocultar();
            });

        }

        if (el.dataset.tabclose) {


            js.print("Click en el Cerrar tab ");
            js.print(el);

            var tab = el.dataset.tab;
            var tabheader = tab + "_header";
            var tabbody = tab + "_body";


            var elementheader = document.getElementById(tabheader);
            var elementcontent = document.getElementById(tabbody);

            /*Si ya el tabView se ha creado y esta en pantalla */
            if (elementcontent !== null && elementheader !== null) {

                var parentNode = elementheader.parentNode;

                if (confirm("Esta seguro que desea cerrar la ventana " + tab)) {

                    js.print("El parentNode");
                    js.print(parentNode);
                    js.print("El lastChild");
                    js.print(Array.prototype.indexOf.call(parentNode.children, elementheader));
                    var index = Array.prototype.indexOf.call(parentNode.children, elementheader);

                    js(elementcontent).Remove();
                    js(elementheader).Remove();

                    js.print(parentNode.length);
                    js.print(parentNode.lastElementChild);
                    js.print(parentNode.children);

                    if (parentNode.children.length > 0) {

                        js.print("Tiene mas de cero");

                        setTab(parentNode.lastElementChild.dataset.tab);
                    }

                }

                // setTabAction(this.dataset.tab);

            }

            /*Si el tabView no se ha creado, entonces se crea*/

        }


        function setTab(tab) {

            var tabheader = tab + "_header";
            var tabbody = tab + "_body";

            var elementheader = document.getElementById(tabheader);
            var elementcontent = document.getElementById(tabbody);

            /*Si ya el tabView se ha creado y esta en pantalla */
            if (elementcontent !== null && elementheader !== null) {

                js(elementcontent).VerOcultar("ver");
                js(elementheader).VerOcultar("ver");

                setTabAction(tab);

            }

        }

        if (el.dataset.tab) {

            var tab = el.dataset.tab;
            var tabheader = tab + "_header";
            var tabbody = tab + "_body";


            var elementheader = document.getElementById(tabheader);
            var elementcontent = document.getElementById(tabbody);

            /*Si ya el tabView se ha creado y esta en pantalla */
            if (elementcontent !== null && elementheader !== null) {

                js(elementcontent).VerOcultar("ver");
                js(elementheader).VerOcultar("ver");

                js(elementheader.parentElement).Move(elementheader);

                setTabAction(el.dataset.tab);


            }

            /*Si el tabView no se ha creado, entonces se crea*/

        }


        if (el.dataset.clearvalue) {
            el.dataset.clearvalue.split(",").forEach(function (sel) {
                js(sel).value("");
                js(sel).foco();
            });

        }

        if (el.dataset.pop) {

            //js.print("Se lanza el pop");
            //js.print(setController);
            currentController.pop();

        }

        if (el.dataset.target) {


            if (el.dataset.searcher && el.dataset.searchercontroller) {
                var ele = document.getElementById(el.dataset.searcher);
                ele.dataset["controller"] = el.dataset.searchercontroller;
                setUpApplicationComponent(ele);
            }

            el.dataset.target.split(",").forEach(function (e) {
                js(e).VerOcultar("ver");
            });
            if (el.dataset.setnavigation) {
                setNavigation(el.dataset.setnavigation);
            }


        }

        if (el.dataset.selectthis) {

            js(el).targetThis();

        }

        if (el.dataset.targetthis) {

            js(el.dataset.targetthis).targetThis();

        }

        if (el.dataset.selectable) {

            js(el).VerOcultar();
            js.print("El selectable del elemonto unico");
            js.print(el);

        }

        if (el.dataset.controller) {

            js.print("Estan los controllers");
            js.print(el.dataset.controller);

            // js.print(JSON.stringify(na));
            //js.print(JSON.parse(el.dataset.controller));


            var controllers = JSON.parse(el.dataset.controller);

            var controllersLoaded = controllers.map(function (performControler) {

                var controller = controladores.buscar({ nombre: performControler.nombre });
                return { ...performControler, ...controller };

            });

            js.print(controllersLoaded);

            setControllers(controllersLoaded, el, evt);

        }


        if (el.dataset.focus) {

            el.dataset.focus.split(",").forEach(function (sel) {
                js(sel).foco();
            });

        }

    }


}
// <editor-fold>

function System(handler) {

    var procesos = [];
    var actions = [];
    var systemActionHandler = handler;
    var sesiontime = 1200000;

    this.sesionStart = function () {
        System.prototype.sesion.sesionTime(new Date().getTime() + sesiontime);
    };

    this.setSystemActionListener = function (fn) {
        systemActionHandler = fn;
    };

    this.action = function (controllerName, context, timer) {
        mkAction(controllerName, context, timer);
    };

    this.checkAction = function (action) {
        checkAction(action);
    };

    this.removeAction = function (action) {
        removeAction(action);
    };

    this.get = function (obj) {
        //js.print("Las actions en cola ---");
        actions.forEach(function (action) {
            //js.print(action.id);
        });
        return actions.buscar(obj);
    };

    function mkAction(controllersList, context, timer) {

        if (!System.prototype.sesion.isActiva()) {
            js.print("----- la Sesion en el cliente no esta activa ");
        }

        var action = actions.buscar({ targetid: context.actionid });

        js.print(" Ciclo de vida de una action ");

        if (!action || context.actionidvariable === "variable") {

            js.print(" 1- Se crea una action nueva");

            action = { id: js.id(), controllers: controllersList, targetid: context.actionid, context: context, data: [], dataHasChanged: false, updateReady: false, activityMutation: new ActivityDataMutationObserver(), complete: false, wait: false, success: null };

        }

        action.context = context;

        js.print(" 1.1- El action a procesar");
        js.print(action);


        if (context.entityaction === "load" || context.entityaction === "analytic" || context.action === "save") {
            addProceso({ id: action.id });
        }

        if (context.entityaction === "logout") {
            js.print("--------- Se llama el logout");
            System.prototype.sesion.close();
        }

        actions.push(action);
        js.print(" 2- Se Adiciona al pool de actions");
        js.print(action);
        riseSystemAction(action);

        if (System.prototype.sesion.isActiva()) {
            js.print("----- la Sesion en el cliente esta activa, se reinicia el time ");
            System.prototype.sesion.sesionTime(new Date().getTime() + sesiontime);
        }

        if (timer) {
            setTimeout(function () {
                actionTimeOut(action);
            }, timer);
        }
    }

    function checkAction(action) {

        js.print("8- Se hace checkAction ");
        js.print(action);

        //  action = actions.buscar(action);
        riseSystemAction(action);

        //js.print("Los procesos en cola " + procesos.length);
        /*  if (action.context.entityaction === "load") {
         riseSystemAction(action);
         }*/
    }

    function removeAction(action) {

        if (action.complete === true && action.wait === false) {

            js.print("9- La action completa se va a eliminar");
            js.print(action);

            //js.print("cantidad de actions en cola antes de eliminar ");
            //js.print(actions.length);
            //js.print("Las actions en cola para eliminar ---");

            js.print("10- Procesos pendientes");
            js.print(procesos);

            removeProceso({ id: action.id });
            actions.splice(actions.indexOf(action), 1);
            return;
        }
    }

    function actionTimeOut(action) {
        action.complete = true;
        checkAction(action);
    }

    function riseSystemAction(systemAction) {
        if (systemActionHandler !== undefined) {
            systemActionHandler(systemAction);
        }
    }

    function addProceso(obj) {
        procesos[procesos.length] = obj;
        js("#loading").traeralfrente().VerOcultar("ver");
    }

    function removeProceso(obj) {

        js.print("11- Proceso a eliminar");
        js.print(obj);

        if (obj.id !== 0) {
            if (procesos.indexOf(obj)) {
                //   var proc = procesos.buscar({id: obj.id});
                setTimeout(function () {
                    aliminaProc(obj);
                }, 1000);
            }
        }
        function aliminaProc(proc) {
            //  js.print("Se llama el time out");
            procesos.splice(procesos.indexOf(proc), 1);
            if (procesos.length === 0) {
                js("#loading").Ocultar();
            }
        }
    }

    this.sesion.setEstadoGuardado = function () {
        //js.print("Este es el estado que se intenta restablecer");
        //js.print(System.prototype.sesion.getEstadoGuardado());
        if (System.prototype.sesion.hasEstadoGuardado()) {
            var estados = System.prototype.sesion.getEstadoGuardado();
            if (estados instanceof Array) {
                estados.forEach(function (estado) {
                    mkAction(estado.controller, estado.context);
                });
            }
        }
    };

    function ActivityDataMutationObserver() {

        var observers = [];


        this.process = [];

        this.change = function (property, change) {

            var observersToCallBack = observers.filter((observer) => observer.property === property || observer.property.startsWith(property + "."));

            if (observersToCallBack) {
                observersToCallBack.forEach(function (observer) {

                    //Se notifica que se ha modificado 1(un) objeto completo 
                    //Existe al menos 1(un) observer a 1(una) propiedad del objeto
                    if (observer.property.startsWith(property + ".")) {

                        //El Objeto observado no tiene propiedades
                        if (change instanceof Object && Object.keys(change).length === 0) {
                            observer.callback("");
                            return;
                        }

                        js.print("El change en el observer");
                        js.print(change);
                        js.print(observer.property);

                        var data = change;
                        var properties = observer.property.replace(property + ".", "").split(".");
                        var propertiesCount = 0;

                        properties.forEach(function (property) {

                            data = data[property];
                            propertiesCount++;

                            if (propertiesCount === properties.length)
                                observer.callback(data);

                            js.print(data);

                        });

                        return;

                    }
                    observer.callback(change);

                });
            }

        };

        this.observer = function (property = null, observer = null) {

            if (property && observer)
                observers.push({ property: property, callback: observer });


        };

    }

}

System.prototype.sesion = new Session();

function Session() {

    var estatus = 0;
    var currentaction;
    var estado = null;
    var sesiontime = 0;
    var estadoGuardado = null;
    var sesionStateHandler = null;

    this.setSesionStateChanged = function (handler) {
        if (handler) {
            sesionStateHandler = handler;
        }
    };

    this.sesionTest = function () {
        testsesion();
    };

    this.close = function () {
        estatus = 0;
        sesiontime = 0;
        testsesion();
    };

    this.sesionTime = function (time) {
        if (time) {
            estatus = 1;
            sesiontime = time;
        }
        return sesiontime;
    };

    this.isActiva = function () {
        return isactiva();
    };

    function testsesion() {
        if (isactiva() === false && estatus === 1) {
            if (sesionStateHandler) {
                sesionStateHandler({ sesion: "off" });
                estatus = 0;
            }
        }
    }
    function isactiva() {

        var fecha = new Date();

        js.print("------- El tiempo " + fecha.getTime());
        js.print("------- El tiempo de la sesion " + sesiontime);
        js.print("------- Diferencia del tiempo " + (sesiontime - fecha.getTime()));
        js.print("------- Es mayor " + (sesiontime >= fecha.getTime()));

        return (sesiontime >= fecha.getTime());
    }
    this.getEstadoGuardado = function () {
        return estadoGuardado;
    };

    this.setCurrentAction = function (action) {
        currentaction = action;
    };

    this.getEstadoPaquete = function () {
        return { id: js.id(), type: "update", entidad: "sesion", modelo: estado, filtro: { filtro: "" }, parametro: "" };
    };

    this.setEstatus = function (obj) { };

    this.setEstado = function (obj, currentAction) {

        if (currentAction) {
            switch (currentAction) {
                case "first":
                    estado = [];
                    estado[0] = obj;
                    break;
                case "second":
                    estado[1] = obj;
                    break;
            }
            return;
        }

        estadoGuardado = obj;
        //js.print("------- Se guarda como estado esta actividad ----");
        //js.print(obj);
    };

    this.setEstadoGuardado = function () {
        //   call(setEstadoGuardado(obj));
    };

    this.hasEstado = function () {
        return estado !== null;
    };

    this.hasEstadoGuardado = function () {
        return estadoGuardado !== null;
    };
}
