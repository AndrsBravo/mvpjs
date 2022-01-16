"use strict";
function EntityManager() {

    var entidades = [];
    var modelos = [];
    var modelosreglas = [];
    var modelcontexts = [];
    var filtros = [];
    var _entityActionHandler;
    var _entityChangeHandler;
    var _notificationHandler;
    var entityActionsRised = [];
    var appActions = [];
    this.setEntityConfig = function (entities) {
        entidades = entities;
    };
    this.getContext = function (obj) {
        return modelcontexts.buscar(obj);
    };
    this.setEntityFiltros = function (filters) {
        filtros = filters;
    };
    this.setModelConfig = function (models) {
        modelos = models;
    };
    this.setModelContext = function (contexts) {
        modelcontexts = contexts;
    };
    this.loadDefaultEntities = function () {
        if (filtros.length > 0)
            filtros.forEach(function (filtro) {
                if (filtro.base) {
                    riseEntityAction(getEntityAction(filtro));
                }
            });
    };
    this.modelo = function (modelo) {
        return modelos.buscar(modelo);
    };
    this.setModel = function (action, model) {
        return setmodel(action, model);
    };
    this.entidad = function (entidad) {
        return entidades.buscar(entidad);
    };
    this.filtro = function (filtro) {
        return filtros.buscar(filtro);
    };
    this.setEntityListener = function (fn) {
        _entityActionHandler = fn;
    };
    this.setNotificationListener = function (fn) {
        _notificationHandler = fn;
    };
    this.setEntityStateChangeListener = function (fn) {
        _entityChangeHandler = fn;
    };

    this.setEntity = function (obj) {

        var entityChangeAction = {id: obj.id, entidad: obj.entidad, action: obj.action, registros: 0};
        var actionRaised = entityActionsRised.buscar({id: obj.id});
        var appAction = appActions.buscar({id: obj.id});

        //js.print("EntitiesAction Rised");
        //js.print(actionRaised);
        var entidad = entidades.buscar({nombre: actionRaised.filtro.entidad});
        //js.print("La data");
        //js.print(obj);
        //js.print(obj.data);
        entityChangeAction.registros = obj.data.length;

        switch (obj.action) {

            case"logout":
                entidad.nivel = 0;
                entidad.data = obj.data;
                js.print("La data del login o logout");
                js.print(obj.data);
                break;
            case"login":
                entidad.data = obj.data;
                /* js.print("La data del login o logout");
                 js.print(obj.data);*/
                break;
            case"load":

                js.print("Load el index");
                js.print(actionRaised);
                if (actionRaised.context.filter === "index") {

                    //Actualizar si hay sub entidad
                    if (entidad.subentidad) {
                        //Actualizar la sub entidad
                        var subentidad = entidad.subentidad.buscar({entidad: actionRaised.context.index});
                        if (!subentidad) {
                            subentidad = {entidad: actionRaised.context.index, nivel: actionRaised.filtro.nivel};
                            entidad.subentidad.push(subentidad);
                        }

                        sustituir();
                        break;
                    }

                    //Actualizar si no hay sub entidad
                    entidad.data.push(obj.data);
                    break;
                }

                //Se evalua el nivel actual de la entidad para sustituir todo o por elementos 
                if (actionRaised.filtro.nivel >= entidad.nivel) {
                    //Se sustituyen todos los datos porq la consulta de este filtro es superior a la actual 
                    entidad.data = obj.data;
                    //Se eleva el nivel actual de la entidad debido aq es superior
                    entidad.nivel = actionRaised.filtro.nivel;
                    //Se eliminan las sub-entidades previamente consultadas para que sean requeridas nueva vez a la base de datos
                    if (entidad.subentidad) {
                        entidad.subentidad = [{}];
                    }

                } else {
                    //Se sustituyen elementos one by one debido a que la consulta del filtro es menor a la actual de la entidad 
                    sustituir();
                }

                break;
            case"analytic":

                //Actualizar la sub entidad
                var subentidad = entidad.subentidad.buscar({entidad: actionRaised.parametro, filtro: actionRaised.filtro.filtro});
                if (!subentidad) {
                    subentidad = {entidad: actionRaised.parametro, filtro: actionRaised.filtro.filtro, data: obj.data};
                    entidad.subentidad.push(subentidad);
                    js.print("------- La entidad en el analytic");
                    js.print(entidad);
                    break;
                }

                subentidad.data = obj.data;
                break;
            case"insert":
                if (obj.data instanceof Array) {
                    entidad.data.unshift(obj.data[0]);
                } else {
                    entidad.data.unshift(obj.data);
                }
                break;
            case"update":
                var identidad = entidad.identidad;
                entityChangeAction.context = {};
                entityChangeAction.context.indexparam = identidad;
                entityChangeAction.context.action = "";
                entityChangeAction.context.filter = "index";
                entityChangeAction.context.entityaction = "load";
                var param = {};
                param[identidad] = obj.data[0][identidad];
                entityChangeAction.context.index = param[identidad];
                sustituir();
                break;
            case"upload":

                js.print("Llega el upload de la entidad");
                js.print("entityActionsRised");
                js.print(actionRaised);
                js.print("obj");
                js.print(obj);
                js.print("appAction");
                js.print(appAction.data[actionRaised.filtro.modelo]);

                var param = {};
                param[appAction.context.indexparam] = obj.data.fileName;
                js.print(param);
                let entity = appAction.data[actionRaised.filtro.modelo].buscar(param);

                switch (actionRaised.filtro.filtro) {

                    case "upload":

                        entity.status = "cancelable";

                        break;
                    case"replace":

                        entity.status = "";

                        break;
                    case"cancel":

                        let index = appAction.data[actionRaised.filtro.modelo].indexOf(entity);
                        appAction.data[actionRaised.filtro.modelo].splice(index, 1);

                        break;

                }

                riseEntityChange(actionRaised);

                return;
                break;
        }

        //Se elimina la actividad lanzada de la cola de actividades 
        js.print("Llega hasta el punto de eliminar la entidad");
        entityActionsRised.splice(entityActionsRised.indexOf(actionRaised), 1);
        riseEntityChange(entityChangeAction);
        function sustituir() {

            if (entidad.identidad) {
                var identidad = entidad.identidad;
                var param = {};
                var elemento = {};
                obj.data.forEach(function (elemento) {
                    param[identidad] = elemento[identidad];
                    //js.print("El param");
                    //js.print(param);
                    //js.print("El elemento en la entidada");
                    //js.print(entidad.data.buscar(param));
                    var o = entidad.data.indexOf(entidad.data.buscar(param));
                    //js.print("La data en la entidada");
                    //js.print(entidad.data);
                    var o = entidad.data.indexOf(entidad.data.buscar(param));
                    //js.print("A sustituir indexOf");
                    //js.print(o);
                    //js.print("El elemento");
                    //js.print(elemento);
                    if (o > -1) {
                        //js.print("Se va a sustituir");
                        entidad.data[o] = elemento;
                    } else {
                        entidad.data.push(elemento);
                    }

                });
            }
        }
    };
    this.getEntity = function (obj) {

        if (!obj.entidad)
            return null;

        if (!obj.param)
            return null;

        var entidad = entidades.buscar({nombre: obj.entidad});

        if (!entidad)
            return null;

        var data = entidad.data.buscar(obj.param);

        return data;


    };

    this.pushDataOnEntity = function (obj) {

        if (!obj.entidad)
            return null;

        if (!obj.data)
            return null;

        var entidad = entidades.buscar({nombre: obj.entidad});

        if (!entidad)
            return null;

        entidad.data.push(obj.data);

    };

    this.setModelRules = function (obj) {
        modelosreglas = obj;
    };

    function getEntityAction(appaction, filtro) {
        var entityAction = {};
        if (filtro) {

            var entidad = entidades.buscar({nombre: filtro.entidad}).entidad;
            entityAction.id = appaction.id;
            entityAction.type = filtro.action;
            entityAction.entidad = entidad;
            entityAction.filtro = filtro;
            entityAction.modelo = {};
            entityAction.context = appaction.context;

        }
        return entityAction;
    }

    function riseEntityAction(appaction, entityAction) {
        if (_entityActionHandler) {
            _entityActionHandler(appaction, entityAction);
            entityActionsRised[entityActionsRised.length] = entityAction;
            appActions[appActions.length] = appaction;
        }
    }

    function riseEntityNotification(obj) {
        if (_notificationHandler) {
            _notificationHandler(obj);
        }
    }

    function riseEntityChange(entityChangeAction) {
        if (_entityChangeHandler) {
            _entityChangeHandler(entityChangeAction);
        }
    }

    function setmodel(appaction, controller) {

        var actioncontext = appaction.context;
        //console.log("seting model");
        //console.log(model);
        if (!controller)
            return false;

        var model = modelos.buscar({nombre: controller.model});

        if (!model) {
            return false;
        }

        var entidadModelo = entidades.buscar({nombre: model.entidad});

        // var actioncontext = getActionContext(context);
        if (!actioncontext) {
            return false;
        }

        //Cuando no se especifique accion ni filtro, cargaran los datos, con valores por defecto 
        if (!controller.action && !controller.filter) {
            entityActionLoad();
            return;
        }

        switch (controller.action) {

            case"load":

                entityActionLoad();

                break;

            case "analytic":

                entityActionAnalitics();

                break;

            case  "update":
                model.complete = true;
                // setNewModel(model, actioncontext);
                break;
            case "email":

                entityActionEmail();

                break;
            case "select":

                entityActionSelect();

                break;

            case "upload":

                entityActionUpload();

                break;
            default :
                entityActionLoad();
        }

        function entityActionLoad() {

            var data = entidadModelo.data;
            var loadResult = {modelo: null};

            var filtro;

            var modelofiltros = filtros.buscar({nombre: model.nombre});


            //Set fintros personalizados con los datos
            if (actioncontext.customfilter && data.length > 0) {

                var losfiltros;

                if (modelofiltros) {
                    losfiltros = modelofiltros.filtros;
                }

                if (losfiltros) {

                    var filtrobase = filtros.buscar({nombre: model.nombre}).filtros.buscar({base: true});
                    filtros.buscar({nombre: model.nombre}).filtros = [];
                    filtros.buscar({nombre: model.nombre}).filtros.push(filtrobase);

                }

                data.forEach(function (item) {

                    var obj = item[actioncontext.customfilter];
                    var filt = {title: "", indexparam: "", nivel: 1, base: false, filtro: "", action: actioncontext.entityaction, current: false};

                    if (typeof (obj) === typeof ({})) {

                        filt.title = obj[actioncontext.filtitle];
                        filt.indexparam = actioncontext.filparam;
                        filt.filtro = obj[actioncontext.fil];

                        var estefiltro = filtros.buscar({nombre: model.nombre}).filtros.buscar(filt);

                        if (!estefiltro) {
                            filtros.buscar({nombre: model.nombre}).filtros.push(filt);
                        }

                    } else {

                        filt.title = item[actioncontext.filtitle];
                        filt.indexparam = actioncontext.filparam;
                        filt.filtro = item[actioncontext.fil];

                        var estefiltro = filtros.buscar({nombre: model.nombre}).filtros.buscar(filt);

                        if (!estefiltro) {
                            filtros.buscar({nombre: model.nombre}).filtros.push(filt);
                        }

                    }

                });

            }

            //El filtro solicitado por el usuario es index "El id de una entidad"
            if (controller.filter && controller.filter === "index") {

                controller.filter = filtros.buscar({filtro: "index", nombre: entidadModelo.nombre});

            }

            //Si no se proporciono index, puede ser otra opcion ALL|HOY|MES|ETC
            if (controller.filter && typeof (controller.filter) === typeof ("") && modelofiltros) {
                controller.filter = modelofiltros.filtros.buscar({filtro: controller.filter});
            }

            //Si el usuario no definio ningun filtro, se aplicara uno por defecto
            if (!controller.filter && modelofiltros) {

                modelofiltros = modelofiltros.filtros;

                //El filtro mas reciente utilizado por el usuario
                if (!controller.filter) {
                    controller.filter = modelofiltros.buscar({current: true});
                }

                //El filtro por defecto
                if (!controller.filter) {
                    controller.filter = modelofiltros.buscar({base: true});
                }

                //Se modifican los filtros para colocar el el mas reciente
                if (modelofiltros) {
                    modelofiltros.forEach(function (filtro) {
                        filtro.current = false;
                    });
                }

                //Se marca como mas reciente
                if (controller.filter) {
                    controller.filter.current = true;
                }
            }

            //Si se selecciono un filtro y los datos en memoria no tiene el nivel, se solicita a la base de datos
            //La consults del index se realiza mas adelante en el codigo
            if (controller.filter && controller.filter.filtro !== "index" && entidadModelo.nivel < controller.filter.nivel) {

                model.complete = false;
                model.wait = true;

                fireRemoteGet(filtro);

                return false;
            }

            if (actioncontext.find && actioncontext.datavalue && actioncontext.datavalue.trim().length > Number(actioncontext.minfindlength)) {

                var dato;
                data = data.filter(function (item) {

                    var result = false;
                    model.filterBy.split(",").forEach(function (filter) {

                        dato = item;

                        filter.split(".").forEach(function (campo) {

                            if (typeof (dato[campo]) === typeof ({})) {
                                //console.log("Es un objeto");
                                //console.log(typeof (dato[filter]));
                                //console.log(dato[filter]);

                                dato = dato[campo];
                                return;
                            }

                            if (dato[campo].trim().indexOf(actioncontext.datavalue.trim()) > -1) {
                                result = true;
                                return;
                            }
                            if (dato[campo].trim().indexOf(actioncontext.datavalue.trim().toUpperCase()) > -1) {
                                result = true;
                                return;
                            }
                            if (dato[campo].trim().indexOf(actioncontext.datavalue.trim().toLowerCase()) > -1) {
                                result = true;
                                return;
                            }
                        });
                    });
                    return result;
                });
            }

            js.print(controller);

            if (!controller.filter) {
                return false;
            }

            switch (controller.filter.filtro) {

                case"all":

                    loadResult.modelo = data;

                    break;
                case"hoy":
                    var dato;
                    loadResult.modelo = data.filter(function (item) {
                        dato = item;
                        var result = false;
                        filtro.indexparam.split(".").forEach(function (filter) {
                            if (typeof (dato[filter]) === typeof ({})) {

                                dato = dato[filter];
                                return;
                            }
                            var fecha = new Date(dato[filter].trim());
                            var hoy = new Date();
                            hoy.setDate(hoy.getDate() - 1);
                            result = (fecha.getTime() > hoy.getTime());
                        });
                        return result;
                    });
                    break;

                case"sem":
                    var dato;
                    loadResult.modelo = data.filter(function (item) {
                        dato = item;
                        var result = false;
                        filtro.indexparam.split(".").forEach(function (filter) {
                            if (typeof (dato[filter]) === typeof ({})) {

                                dato = dato[filter];
                                return;
                            }
                            var fecha = new Date(dato[filter].trim());
                            var hoy = new Date();
                            hoy.setDate(hoy.getDate() - 7);
                            result = (fecha.getTime() > hoy.getTime());
                        });
                        return result;
                    });

                    break;
                case"mes":
                    var dato;
                    loadResult.modelo = data.filter(function (item) {
                        dato = item;
                        var result = false;
                        filtro.indexparam.split(".").forEach(function (filter) {
                            if (typeof (dato[filter]) === typeof ({})) {

                                dato = dato[filter];
                                return;
                            }
                            var fecha = new Date(dato[filter].trim());
                            var hoy = new Date();
                            hoy = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
                            result = (fecha.getTime() > hoy.getTime());
                        });
                        return result;
                    });
                    break;
                case"30d":
                    var dato;
                    loadResult.modelo = data.filter(function (item) {
                        dato = item;
                        var result = false;
                        filtro.indexparam.split(".").forEach(function (filter) {
                            if (typeof (dato[filter]) === typeof ({})) {

                                dato = dato[filter];
                                return;
                            }
                            var fecha = new Date(dato[filter].trim());
                            var hoy = new Date();
                            hoy.setDate(hoy.getDate() - 31);
                            result = (fecha.getTime() > hoy.getTime());
                        });
                        return result;
                    });
                    break;

                case "index":

                    if (!actioncontext)
                        return null;

                    if (actioncontext.filterresult === "list") {

                        var filtro = filtros.buscar({nombre: "index", entidad: entidadModelo.nombre});
                        var subentidad = entidadModelo.subentidad.buscar({entidad: actioncontext.index});
                        if (subentidad === null || subentidad.nivel < filtro.nivel) {

                            var entityaction = getEntityAction(appaction, filtro);
                            entityaction.modelo = actioncontext.index;
                            entityaction.parametro = actioncontext.indexparam.split(".").pop();
                            riseEntityAction(appaction, entityaction);
                            return false;
                        }

                        var dato;
                        loadResult.modelo = data.filter(function (item) {

                            dato = item;
                            var result = false;
                            actioncontext.indexparam.split(".").forEach(function (filter) {

                                if (typeof (dato[filter]) === typeof ({})) {
                                    dato = dato[filter];
                                    return;
                                }

                                if (dato[filter] === actioncontext.index) {
                                    result = true;
                                    return;
                                }

                            });
                            return result;
                        });

                    } else {

                        var parametro = {};
                        parametro[controller.filter.indexparam] = actioncontext[controller.filter.indexvalue];
                        //js.print("La data en el index es ");
                        //js.print(data);
                        //js.print("El parametro");
                        //js.print(parametro);
                        loadResult.modelo = data.buscar(parametro);
                        //js.print("el modelo");
                        //js.print(loadResult);

                        if (!loadResult.modelo) {
                            js.print("Se procesa este lio");
                            var filtro = filtros.buscar({nombre: "index", entidad: entidadModelo.nombre});
                            var entityaction = getEntityAction(appaction, filtro);
                            entityaction.modelo = actioncontext.index;
                            entityaction.parametro = actioncontext.indexparam.split(".").pop();
                            riseEntityAction(appaction, entityaction);
                            return false;
                        }
                    }
                    break;
                case "order":
                    loadResult.modelo = entidadModelo.data[actioncontext.order];
                    break;

                default:
                    
                    var dato;
                    loadResult.modelo = data.filter(function (item) {
                        dato = item;
                        var result = false;
                        filtro.indexparam.split(".").forEach(function (filter) {
                            if (typeof (dato[filter]) === typeof ({})) {

                                dato = dato[filter];
                                return;
                            }

                            result = (dato[filter] === filtro.filtro);
                        });
                        return result;
                    });

                    break;
            }

            js.print("4- El modelo en la action se ejecuta perfectamente y se completa");
            js.print(appaction);

            js.print("El +++++loadResult++++");
            js.print(loadResult);

            model.modelo = loadResult;
            if (appaction.data) {
                appaction.data[model.nombre] = loadResult.modelo;
            }
            model.complete = true;
            model.wait = false;


        }

        function entityActionAnalitics() {

            var data;
            var filtro;
            var subentidad;

            js.print("-------- custom filtro y cantidad de datos  ");
            js.print((actioncontext.customfilter && data.length > 0));


            //Set fintros personalizados con los datos
            if (actioncontext.customfilter && data.length > 0) {

                var losfiltros;

                if (modelofiltros) {
                    losfiltros = modelofiltros.filtros;
                }

                if (losfiltros) {

                    var filtrobase = filtros.buscar({nombre: model.nombre}).filtros.buscar({base: true});
                    filtros.buscar({nombre: model.nombre}).filtros = [];
                    filtros.buscar({nombre: model.nombre}).filtros.push(filtrobase);

                }

                data.forEach(function (item) {

                    var obj = item[actioncontext.customfilter];
                    var filt = {title: "", indexparam: "", nivel: 1, base: false, filtro: "", action: actioncontext.entityaction, current: false};

                    if (typeof (obj) === typeof ({})) {

                        filt.title = obj[actioncontext.filtitle];
                        filt.indexparam = actioncontext.filparam;
                        filt.filtro = obj[actioncontext.fil];

                        var estefiltro = filtros.buscar({nombre: model.nombre}).filtros.buscar(filt);

                        if (!estefiltro) {
                            filtros.buscar({nombre: model.nombre}).filtros.push(filt);
                        }

                    } else {

                        filt.title = item[actioncontext.filtitle];
                        filt.indexparam = actioncontext.filparam;
                        filt.filtro = item[actioncontext.fil];

                        var estefiltro = filtros.buscar({nombre: model.nombre}).filtros.buscar(filt);

                        if (!estefiltro) {
                            filtros.buscar({nombre: model.nombre}).filtros.push(filt);
                        }

                    }

                });

            }


            //Se aplica el filtro requerido a la data
            if (modelofiltros) {

                modelofiltros = modelofiltros.filtros;

                if (actioncontext.filter) {
                    filtro = modelofiltros.buscar({filtro: actioncontext.filter});
                }

                if (!filtro) {
                    filtro = modelofiltros.buscar({current: true});
                }

                if (!filtro) {
                    filtro = modelofiltros.buscar({base: true});
                }
                if (actioncontext.filter == undefined && filtro != null) {
                    actioncontext["filter"] = filtro.filtro;
                }
                if (modelofiltros) {
                    modelofiltros.forEach(function (filtro) {
                        filtro.current = false;
                    });
                }

                if (filtro) {
                    filtro.current = true;
                }

                subentidad = entidadModelo.subentidad.buscar({entidad: model.nombre, filtro: filtro.filtro});

                if (!subentidad) {

                    filtro["entidad"] = model.entidad;
                    var entityaction = getEntityAction(appaction, filtro);
                    entityaction.modelo = "";
                    entityaction.parametro = model.nombre;
                    riseEntityAction(appaction, entityaction);
                    return false;
                }
            }

            model.modelo = subentidad.data;

            model.complete = true;

            /*
             case "insert" :
             setNewModel(model, actioncontext);
             break;*/

        }

        function entityActionEmail() {

            model.complete = true;
            var emails = modelos.buscar({nombre: "emails"});

            if (actioncontext.action && actioncontext.action === "save") {


            } else if (actioncontext.action && actioncontext.action === "selected") {

                emails["modelo"] = [];
                var selected = modelos.buscar({nombre: "selected"});
                var identidad = entidades.buscar({nombre: selected.entidad}).identidad;
                var numero = entidades.buscar({nombre: selected.entidad}).numero;
                js.print("+++++++++++ El selected ++++++++++");
                js.print(selected);
                emails.entidad = selected.entidad;
                selected.modelo.data.forEach(function (dato) {
                    var res = emails.modelo.buscar({id: dato.cliente.clienteId});
                    if (res) {
                        // var res = email.modelo.buscar({id: dato.cliente.clienteId});
                        var parametro = {};
                        parametro[identidad] = dato[identidad];
                        parametro[numero] = dato[numero];
                        res.documents.push(parametro);
                        res.text += ", " + dato[numero];
                    } else {
                        emails.modelo.push({id: "", cliente: {}, documents: [], emails: [], subject: "", text: "", docSeparados: false});
                        var res = emails.modelo[emails.modelo.length - 1];
                        res.id = dato.cliente.clienteId;
                        res.cliente = dato.cliente;
                        res.subject = "Sres. " + res.cliente.nombreClte;
                        res.text = "Sres. " + res.cliente.nombreClte + ", adjunto documento(s) " + dato[numero];

                        var parametro = {};
                        parametro[identidad] = dato[identidad];
                        parametro[numero] = dato[numero];
                        res.documents.push(parametro);

                        if (dato.cliente.eMail1 !== "") {
                            res.emails.push(dato.cliente.eMail1);
                        }
                        if (dato.cliente.eMail2 !== "") {
                            res.emails.push(dato.cliente.eMail2);
                        }
                    }
                });
                js.print("El modelo Original");
                js.print(model);
                js.print("El modelo Email");
                js.print(modelos.buscar({nombre: "emails"}));
            } else if (actioncontext.action && actioncontext.action === "email") {

                var email = modelos.buscar({nombre: "email"});
                email.modelo = emails.modelo.buscar({id: actioncontext.index});
                js.print("El modelo Original");
                js.print(model);
                js.print("El modelo Emails");
                js.print(modelos.buscar({nombre: "emails"}));


            } else {
                /*  if (actioncontext.modelo) {
                 model = modelos.buscar({nombre: actioncontext.modelo});
                 }
                 */

                var identidad = entidades.buscar({nombre: model.entidad}).identidad;
                var numero = entidades.buscar({nombre: model.entidad}).numero;

                js.print("------El modelo en el email----");
                js.print(model);

                emails["modelo"] = [];
                var newEmail = {id: "", cliente: {}, documents: [], emails: [], subject: "", text: "", docSeparados: false};
                emails.modelo.push(newEmail);
                newEmail.id = model.modelo.cliente.clienteId;
                newEmail.cliente = model.modelo.cliente;
                newEmail.subject = "Sres. " + newEmail.cliente.nombreClte;
                newEmail.text = "Sres. " + newEmail.cliente.nombreClte + ", adjunto documento(s) " + model.modelo[numero];

                var parametro = {};
                parametro[identidad] = model.modelo[identidad];
                parametro[numero] = model.modelo[numero];
                newEmail.documents.push(parametro);

                if (model.modelo.cliente.eMail1.trim !== "") {
                    newEmail.emails.push(model.modelo.cliente.eMail1);
                }
                if (model.modelo.cliente.eMail2.trim !== "") {
                    newEmail.emails.push(model.modelo.cliente.eMail2);
                }

                emails.entidad = model.entidad;

                js.print("El modelo Original");
                js.print(model);
                js.print("El modelo Email");
                js.print(modelos.buscar({nombre: "emails"}));

            }
        }

        function entityActionUpload() {

            switch (actioncontext.filter) {

                case"upload":

                    js.print("*++*-+*-+*-+*-+*-+*-+*-*+-+*-");
                    js.print("*++*-+*-+*-+*-+*-+*-+*-*+-+*-");
                    js.print(actioncontext);
                    js.print(actioncontext.datavalue);

                    var callback = (data) => {

                        js.print("La data que se enviaria");
                        js.print(data);

                        riseEntityAction(appaction, {id: appaction.id, type: actioncontext.entityaction, context: actioncontext,
                            entidad: entidades.buscar({nombre: model.entidad}).entidad,
                            modelo: data,
                            filtro: {filtro: actioncontext.filter, modelo: model.nombre, entidad: model.entidad}});

                    };

                    //Tomando los files subidos por el usuario
                    //  var files = js.fileSlicers(actioncontext.datavalue.files, callback);


                    //Creando la data del action 
                    if (!appaction.data[model.nombre]) {

                        appaction.data[model.nombre] = [];

                    }

                    //Adicionando los files a la data del action 
                    actioncontext.datavalue.forEach((file) => {

                        js.print(file);

                        var dato = appaction.data[model.nombre].find((fileSlicer) => fileSlicer.file.name === file.name);

                        if (!dato) {
                            appaction.data[model.nombre].push(js.fileSlicers([file], callback)[0]);
                        }

                    });

                    appaction.data[model.nombre].forEach(fileSlicer => {

                        fileSlicer.getData(50);

                    });


                    /* riseEntityAction(appaction, {id: appaction.id, type: actioncontext.entityaction, context: actioncontext,
                     entidad: entidades.buscar({nombre: model.entidad}).entidad,
                     modelo: dataEnviar,
                     filtro: {filtro: "upload", entidad: model.entidad}});
                     */

                    break;
                case"replace":

                    js.print("Vamos a reemplazar este elemento");
                    js.print(appaction.context.index);

                    let parametros = {};

                    parametros[appaction.context.indexparam] = appaction.context.index;
                    var fileToReplace = appaction.data[model.nombre].buscar(parametros);

                    if (fileToReplace && fileToReplace.status.length > 0) {

                        riseEntityAction(appaction, {id: appaction.id, type: actioncontext.entityaction, context: actioncontext,
                            entidad: entidades.buscar({nombre: model.entidad}).entidad,
                            modelo: fileToReplace.data(),
                            filtro: {filtro: actioncontext.filter, modelo: model.nombre, entidad: model.entidad}});
                    }


                    break;
                case"cancel":

                    js.print("Vamos a cancelar este elemento");
                    js.print(appaction.context.index);
                    let param = {};

                    param[appaction.context.indexparam] = appaction.context.index;
                    js.print(param);
                    var fileToCancel = appaction.data[model.nombre].buscar(param);

                    if (fileToCancel) {

                        riseEntityAction(appaction, {id: appaction.id, type: actioncontext.entityaction, context: actioncontext,
                            entidad: entidades.buscar({nombre: model.entidad}).entidad,
                            modelo: fileToCancel.data(),
                            filtro: {filtro: actioncontext.filter, modelo: model.nombre, entidad: model.entidad}});

                    }

                    break;

            }

            model.complete = true;
            model.wait = false;


        }

        function entityActionSelect() {
            model.complete = true;
            var selected = modelos.buscar({nombre: "selected"});
            switch (actioncontext.action) {
                case"create":

                    selected.entidad = model.entidad;
                    setNewModel(selected, actioncontext);
                    js.print("El model selected");
                    js.print(selected);
                    break;
                case"update":

                    // actioncontext.entidad = entidades.buscar({nombre: model.entidad}).entidad;
                    var param = actioncontext.index;
                    var parametro = {};
                    parametro[actioncontext.indexparam] = param;
                    js.print("La actioncontext");
                    js.print(actioncontext);
                    var data = entidades.buscar({nombre: selected.entidad}).data.buscar(parametro);
                    if (actioncontext.datavalue === true) {
                        js.print("En este caso se agregara el elemento");
                        selected.modelo.data.push(data);
                    } else if (actioncontext.datavalue === false) {
                        js.print("En este caso se eliminara el elemento");
                        selected.modelo.data.splice(selected.modelo.data.indexOf(data), 1);
                    }
                    js.print("El model selected");
                    js.print(selected);
                    break;
            }
            return true;
        }

        function fireRemoteGet(filtro) {
            //Si la entidad no esta cargada con el nivel requerido, se elabora una consulta, para llevarla al nivel
            filtro["entidad"] = model.entidad;
            js.print("4- El modelo en la action no se puede ejecutar");
            js.print(appaction);
            riseEntityAction(appaction, getEntityAction(appaction, filtro));
        }

        function setUpFiltros() {


            var modelofiltros = filtros.buscar({nombre: model.nombre});


            js.print("-------- custom filtro y cantidad de datos  ");
            js.print((actioncontext.customfilter && data.length > 0));

            //Set fintros personalizados con los datos
            if (actioncontext.customfilter && data.length > 0) {

                var losfiltros;

                if (modelofiltros) {
                    losfiltros = modelofiltros.filtros;
                }

                if (losfiltros) {

                    var filtrobase = filtros.buscar({nombre: model.nombre}).filtros.buscar({base: true});
                    filtros.buscar({nombre: model.nombre}).filtros = [];
                    filtros.buscar({nombre: model.nombre}).filtros.push(filtrobase);

                }

                data.forEach(function (item) {

                    var obj = item[actioncontext.customfilter];
                    var filt = {title: "", indexparam: "", nivel: 1, base: false, filtro: "", action: actioncontext.entityaction, current: false};

                    if (typeof (obj) === typeof ({})) {

                        filt.title = obj[actioncontext.filtitle];
                        filt.indexparam = actioncontext.filparam;
                        filt.filtro = obj[actioncontext.fil];

                        var estefiltro = filtros.buscar({nombre: model.nombre}).filtros.buscar(filt);

                        if (!estefiltro) {
                            filtros.buscar({nombre: model.nombre}).filtros.push(filt);
                        }


                    } else {

                        filt.title = item[actioncontext.filtitle];
                        filt.indexparam = actioncontext.filparam;
                        filt.filtro = item[actioncontext.fil];

                        var estefiltro = filtros.buscar({nombre: model.nombre}).filtros.buscar(filt);

                        if (!estefiltro) {
                            filtros.buscar({nombre: model.nombre}).filtros.push(filt);
                        }

                    }

                });

            }

            //Se aplica el filtro requerido a la data
            if (modelofiltros) {

                modelofiltros = modelofiltros.filtros;

                if (actioncontext.filter) {
                    filtro = modelofiltros.buscar({filtro: actioncontext.filter});
                }

                if (!filtro) {
                    filtro = modelofiltros.buscar({current: true});
                }

                if (!filtro) {
                    filtro = modelofiltros.buscar({base: true});
                }
                if (actioncontext.filter == undefined && filtro != null) {
                    actioncontext["filter"] = filtro.filtro;
                }
                if (modelofiltros) {
                    modelofiltros.forEach(function (filtro) {
                        filtro.current = false;
                    });
                }


                if (filtro) {
                    filtro.current = true;
                }

                if (entidadModelo.nivel < filtro.nivel) {

                    fireRemoteGet(filtro);

                    return false;
                }
            }

            return true;

        }

        setNewModel(model, actioncontext);

        function setNewModel(model, context) {
            if (!context)
                return;
            if (!context.action)
                return;
            var action = {model: model.nombre, action: context.action};
            switch (context.action) {
                case "create":
                    var regla = modelosreglas.buscar(action).rule;
                    model.modelo = js.create(regla);
                    appaction.data[model.nombre] = model.modelo;
                    model.complete = true;
                    break;
                case "refresh":

                    var filtro = modelofiltros.buscar({current: true});

                    if (!filtro) {
                        filtro = modelofiltros.buscar({base: true});
                    }

                    fireRemoteGet(filtro);

                    break;
                case "update":

                    var regla = modelosreglas.buscar(action).rule;
                    var param = context.index;
                    if (!param)
                        return null;
                    var parametro = {};
                    parametro[context.indexparam] = param;
                    var data = entidades.buscar({entidad: context.entidad}).data.buscar(parametro);
                    switch (regla[context.entidad]) {
                        case "susb":
                            model.modelo[context.entidad] = data;
                            break;
                        case "add":
                            if (model.modelo[context.entidad] instanceof Array) {
                                model.modelo[context.entidad][model.modelo[context.entidad].length] = data;
                            }
                            break;
                        case "transform":
                            var action = {model: model.nombre, action: "transform"};
                            var newregla = modelosreglas.buscar(action).rule;
                            var entidadTrasform = newregla[context.entidad];
                            if (newregla.action === "create") {
                                var obj = js.create(newregla.rule);
                                // console.log(obj);
                                obj[context.entidad] = data;
                                // console.log(obj);
                                if (regla[entidadTrasform] === "susb") {
                                } else if (regla[entidadTrasform] === "add") {
                                    if (model.modelo[entidadTrasform] instanceof Array)
                                    {
                                        model.modelo[entidadTrasform].unshift(obj);
                                    } else {
                                        model.modelo[entidadTrasform] = obj;
                                    }
                                }
                            }
                            break;
                    }
                    model.complete = true;
                    break;
                case "deleteOrder":
                    if (model.modelo) {

                        if (context.entidad) {
                            if (model.modelo[context.entidad]) {
                                model.modelo[context.entidad].splice(context.order, 1);
                            }
                        } else {

                        }
                    }
                    model.complete = true;
                    break;
                case "updateValue":

                    //js.print("Llega al updateValue");

                    var regla = modelosreglas.buscar(action);
                    if (regla) {

                        var updateReglas = regla.rule.buscar({nombre: context.value});
                        var el = model.modelo;
                        if (updateReglas) {
                            if (!evaluate(updateReglas.reglas, context)) {
                                model.complete = true;
                                break;
                            }
                        }
                    }

                    if (el) {
                        if (context.entidad) {

                            el = model.modelo[context.entidad];
                        }
                        if (context.order) {
                            el = el [context.order];
                        }

                        var pro = context.value.split(".");
                        if (pro.length > 1)
                        {
                            pro.forEach(function (item) {
                                el = el[item];
                            });
                        } else {

                            if (context.format === "numeric") {
                                if (context.datavalue === "" || isNaN(context.datavalue)) {
                                    el[context.value] = 0
                                } else {
                                    el[context.value] = Number.parseFloat(context.datavalue);
                                }
                                //js.print("El valor del dato asignado es ");
                                //js.print(el[context.value]);
                            } else if (el[context.value] instanceof Array) {
                                el[context.value].push(context.datavalue);
                            } else if (context.format === "checkuncheck") {
                                el[context.value] = (el[context.value] !== true)
                            } else {
                                js.print("Val");
                                js.print(el);
                                el[context.value] = context.datavalue;
                            }

                        }
                    }
                    model.complete = true;
                    break;

                case "save":
                    //Validacion del proceso save no estandarizada especifica para guardar los pedidos
                    /*Se queda pendiente trabajar la estandarizacion de este proceso*/
                    var regla = modelosreglas.buscar(action).rule;
                    var data = model.modelo;
                    //model.modelo.estimadoDetalleList.length > 0 && model.modelo.cliente.clienteId !== undefined

                    if (context.entityaction === "logout") {
                        model.complete = false;
                        riseEntityAction(appaction, {id: appaction.id, type: context.entityaction, context: context,
                            entidad: entidades.buscar({nombre: model.entidad}).entidad,
                            modelo: model.modelo,
                            filtro: {filtro: "", entidad: model.entidad}});
                        break;
                    }

                    if (evaluate(regla, data)) {
                        //  console.log(model.callback);
                        //js.print("El context.entityaction");
                        //js.print(context.entityaction);
                        model.complete = false;
                        riseEntityAction(appaction, {id: appaction.id, type: context.entityaction, context: context,
                            entidad: entidades.buscar({nombre: model.entidad}).entidad,
                            modelo: model.modelo,
                            filtro: {filtro: "", entidad: model.entidad}});
                    } else {
                        model.complete = true;
                    }


                    /*
                     else {
                     riseEntityNotification({tipo: "adv", texto: "No es posible actualizar estos datos, verifique que ha colocado produstos y un cliente valido"});
                     }*/
                    break;
            }
        }

        return true;
    }

    function evaluate(reglas, data) {

        var result = true;
        js.print("Data");
        js.print(data);

        if (data instanceof Array) {
            var i = 1;

            data.forEach(function (dato) {

                reglas.forEach(function (regla) {
                    if (!validate(regla, dato)) {
                        riseEntityNotification({tipo: regla.outputtype, texto: regla.output + " \n en la linea " + i});
                        result = false;
                        return;
                    }
                });

                i++;
            });


        } else {
            reglas.forEach(function (regla) {
                if (!validate(regla, data)) {
                    riseEntityNotification({tipo: regla.outputtype, texto: regla.output});
                    result = false;
                    return;
                }
            });
        }
        return result;
    }

    function validate(regla, data) {
        var result = true;
        switch (regla.valor) {
            case ">0":
                var dato = data;
                regla.campo.split(".").forEach(function (propiedad) {
                    result = true;
                    //js.print("El Resultado del dato");
                    //js.print(dato);
                    //js.print(dato[propiedad]);
                    //js.print(propiedad);

                    if (!dato[propiedad] || dato[propiedad] <= 0 || isNaN(dato[propiedad])) {

                        result = false;
                        //  return false;
                    }

                    dato = dato[propiedad];
                });
                break;
            case "length>0":
                break;
            case "notnull":
                var dato = data;
                regla.campo.split(".").forEach(function (propiedad) {

                    if (!dato[propiedad] || dato[propiedad] === "") {

                        result = false;
                        return false;
                    }
                    dato = dato[propiedad];
                });
                break;
            case "email":

                var dato = data;
                regla.campo.split(".").forEach(function (propiedad) {

                    var pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
                    js.print("El email macha");
                    js.print(pattern.test(dato[propiedad]));
                    if (!pattern.test(dato[propiedad])) {

                        result = false;
                        return false;
                    }

                    dato = dato[propiedad];
                });
                break;
            case "all":
                break;
        }

        return result;
    }

}

