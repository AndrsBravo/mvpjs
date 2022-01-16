"use strict";
(function () {

    var manejadores = {};

    var js = function (el) {
        return new miJs(el);
    };

    function miJs(el) {

        this.length = 0;
        var contexto = this;

        var push = function (el) {
            contexto[contexto.length] = el;
            contexto.length++;
        };

        if (typeof (el) == "function") {
            window.addEventListener("load", el);
            return null;
        }

        if (typeof (el) == "undefined") {
            el = document;
            return null;
        }

        if (el instanceof HTMLElement) {
            push(el);
            return this;
        }

        if (el instanceof NodeList) {
            for (var a = 0; a < el.length; a++) {
                push(el[a]);
            }
            return this;
        }

        if (el instanceof HTMLCollection) {
            for (var a = 0; a < el.length; a++) {
                push(el[a]);
            }
            return this;
        }

        if (isNaN(el)) {

            //Se entiende que es un String(id, class)
            el = document.querySelectorAll(el);
            if (el.length > 0) {

                for (var a = 0; a < el.length; a++) {
                    push(el[a]);
                }
                return this;
            }

        }

        js.print(el);
        // throw new Error("El selector " + el + " no es valido o no existe en el documento");
    }

    miJs.prototype = new miJsObject();

    function miJsObject() {


        //Agregar eventos a elementos
        this.evento = function (evento, manejador) {

            this.forEach(function (item) {

                item.addEventListener(evento, manejador, false);

            });

        };

        //Agregar eventos a elementos
        this.evento = function (evento, manejador, condicion = false) {

            this.forEach(function (item) {

                item.addEventListener(evento, manejador, condicion);

            });

        };

        this.eventOnce = function (evento, manejador) {

            this.forEach(function (item) {

                item["on" + evento] = manejador;

            });

        };

        this.Observe = function (config, callback) {

            this.forEach(function (item) {

                var observer = new MutationObserver(callback);
                observer.observe(item, config);


            });

        };

        //Remover eventos a elementos
        this.removeEvento = function (evento, manejador) {

            this.forEach(function (item) {
                item.removeEventListener(evento, manejador);
            });

        };

        //Manejar eventos al agregar elementos a un componente
        this.appendChildEvento = function (manejador) {

            this.forEach(function (item) {

                if (!manejadores[item.id])
                    manejadores[item.id] = [];

                manejadores[item.id][manejadores[item.id].length] = manejador;

                item.appendChild = function (child) {

                    var element = HTMLElement.prototype.appendChild.call(this, child);

                    manejadores[item.id].forEach(function (mane) {
                        mane(element);
                    });

                    return element;

                };

            });

        };

        //Funcion para eliminar elementos del DOM
        this.Remove = function () {
            this.forEach(function (el) {
                el.parentNode.removeChild(el);
            });

        };

        //Funcion para Colocar resizing en los elementos
        this.dropZone = function () {

            this.forEach(function (el) {

                ["dragenter", "dragover", "dragleave"].forEach(function (eventName) {

                    el.addEventListener(eventName, function (evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                    }, false);

                });

            });

        };

        //Funcion para Colocar resizing en los elementos
        this.Resize = function () {

            this.forEach(function (el) {

                var rect = el.getBoundingClientRect();
                if (el.classList.contains("n-resize")) {
                    el.style.height = `${Math.round(rect.height)}px`;
                }
                if (el.classList.contains("w-resize")) {
                    el.style.width = `${Math.round(rect.width)}px`;
                }

                el.addEventListener("mousedown", function (e) {


                    window.onmousemove = mousemove;
                    window.onmouseup = mouseup;

                    function mousemove(evt) {



                        var multiplicador = 1.1;
                        var height = Number(el.style.height.replace("px", ""));
                        var width = Number(el.style.width.replace("px", ""));

                        if (el.classList.contains("n-resize")) {

                            el.style.height = `${height + (0 - (evt.movementY * multiplicador))}px`;
                        }

                        if (el.classList.contains("w-resize")) {

                            el.style.width = `${width + (0 - evt.movementX)}px`;
                        }


                    }


                    function mouseup(evt) {



                        window.onmousemove = null;
                        window.onmouseup = null;


                        // el.style.height = (elementHeight + pos - evt.clientY) + "px";

                    }





                });






            });

        };

        //Funcion para mover el contenedor de los tabs
        this.Move = function (tab = null) {

            this.forEach(function (el) {

                var parent = el.parentElement;
                var width = el.offsetWidth;
                var parentWidth = parent.clientWidth;
                var defaulLeft = 0;

                var left = parentWidth - width;

                if (tab) {

                    left = parentWidth - tab.offsetLeft - tab.offsetWidth;

                }

                el.style.left = Math.min(left, defaulLeft) + "px";

            });

        };

        //Funcion para mover izquierda el contenedor de los tabs
        this.Moveleft = function () {

            this.forEach(function (el) {

                var parent = el.parentElement;
                var width = el.offsetWidth;
                var left = el.style.left.trim();
                var parentWidth = parent.clientWidth;
                var maxleft = parentWidth - width;

                left = Number(left.replace("px", ""));

                if (width < (parentWidth + left)) {
                    return;
                }


                var moveRange = 0;
                var elementCount = 0;

                el.childNodes.forEach(function (elemento) {

                    if (elemento instanceof HTMLElement) {

                        moveRange += elemento.offsetWidth;
                        elementCount++;

                        js.print(elemento.offsetWidth);
                    }

                });

                moveRange /= elementCount;
                moveRange = Math.round(moveRange);

                left = Number(left) + (0 - moveRange);

                el.style.left = Math.max(left, maxleft) + "px";


            });

        };

        //Funcion para mover derecha el contenedor de los tabs
        this.Moveright = function () {

            this.forEach(function (el) {

                var left = el.style.left.trim();
                var minleft = 0;

                left = Number(left.replace("px", ""));

                if (left >= 0) {
                    return;
                }

                var moveRange = 0;
                var elementCount = 0;

                el.childNodes.forEach(function (elemento) {

                    if (elemento instanceof HTMLElement) {

                        moveRange += elemento.offsetWidth;
                        elementCount++;

                        js.print(elemento.offsetWidth);
                    }

                });

                moveRange /= elementCount;
                moveRange = Math.round(moveRange);

                left = Number(left) + moveRange;

                el.style.left = Math.min(left, minleft) + "px";


            });

        };

        //Funcion para ver y ocultar un elemento con una clase Selected
        this.VerOcultar = function (val) {
            this.forEach(function (el) {
                return _verOcultar(el, val);
            });

        };

        //Funcion para ver y ocultar un elemento con una clase Selected
        this.Ver = function () {

            return this.aggCls("selected");

        };

        //Funcion para ver y ocultar un elemento con una clase Selected
        this.Ocultar = function () {

            return this.qtrCls("selected");

        };

        //Funcion que permite seleccionar el elemento especificado mediante id y oculta los demas elementos 
        this.targetThis = function () {

            var el = this[0];

            js(el.parentElement.children).Ocultar();
            js(el).Ver();

        };



        //funcion tabulacion de elementos
        this.Tab = function (ind, cont, vi) {
            if (vi == undefined) {
                vi = 0;
            }
            var i = document.querySelectorAll(ind);
            var co = document.querySelectorAll(cont);
            var a = 0;

            if (i.length > 0) {
                i.forEach(function (item) {

                    //tabindex para identificar el indice que se ejecuta el evento click
                    item.tabIndex = a;
                    a++;

                    //agregamos el evento click al boton indice
                    item.addEventListener("click", function (evt) {
                        evt.preventDefault();

                        _verOcultar(i, "ocultar");
                        _verOcultar(co, "ocultar");
                        _verOcultar(evt.target, "ver");
                        _verOcultar(co[evt.target.tabIndex], "ver");

                    });


                });
            }

            _verOcultar(i[vi], "ver");
            _verOcultar(co[vi], "ver");
        };

        //funcion tablas
        this.tablaFormato = function () {
            var tabla = this[0];
            var cap = document.createElement("CAPTION");
            var tn = document.createTextNode("");
            var cantPag = 5;
            var pagina = 1;
            cap.appendChild(tn);
            cap.innerHTML = "<div class=\"campo\"><div class=\"select\"><select>" +
                "<option value=\"5\">5 / P</option>" +
                "<option value=\"10\">10 / P</option>" +
                "<option value=\"15\">15 / P</option>" +
                "<option value=\"20\">20 / P</option>" +
                "<option value=\"30\">30 / P</option>" +
                "</select></div></div>";
            this[0].insertBefore(cap, this[0].childNodes[0]);

            var foot = document.createElement("div");
            var tx = document.createTextNode("");
            foot.className = "col w_100";
            foot.id = "btn_accion";
            this[0].parentElement.appendChild(foot);
            foot.addEventListener("click", function (evt) {
                if (evt.target.tagName == "SPAN") {
                    pagina = parseInt(js(evt.target).obtAtr("indice"));
                    setPage(pagina);
                }
            });

            js("#" + tabla.id + " caption select").evento("change", function (evt) {
                cantPag = parseInt(evt.target.value);
                setTabla();
                setPage(pagina);
            });

            this[0].insertRow = function (e) {
                var row = HTMLTableElement.prototype.insertRow.call(this, e);
                if (tabla.rows.length > (cantPag + 1)) {
                    row.style = "visibility:hidden;display:none;";
                }
                setTabla();
                return row;
            }

            var setTabla = function () {
                var btn_accion = tabla.parentElement.querySelector("#btn_accion");
                var btns = "";
                var i = 0;
                var pags = (tabla.rows.length + 1) / parseInt(cantPag);
                if (tabla.rows.length > (cantPag + 1)) {
                    while (i < pags) {
                        i++;
                        btns += "<span class=\"btn\" indice=\"" + i + "\">" + i + "</span>"
                    }
                }
                btn_accion.innerHTML = btns;
            }
            var setPage = function (page) {
                page = parseInt(page);
                var lineas = cantPag * page;
                var desdeLinea = lineas - cantPag;
                for (var i = 1; i < tabla.rows.length; i++) {
                    tabla.rows[i].style = "visibility:hidden;display:none;";
                    if (i > desdeLinea && i <= lineas) {
                        tabla.rows[i].removeAttribute("style");
                    }
                }
            }
        }

        //Traer al frente

        this.traeralfrente = function () {
            return this.aggCls("traer_frente");
        };

        //Funcion para agregar atributos
        this.aggAtr = function (attr, val) {

            this.forEach(function (el) {

                el.setAttribute(attr, val);

            });

            return this;
        };

        //Funcion para agregar Clases
        this.aggCls = function (val) {

            this.forEach(function (el) {

                if (val.trim() !== "") {
                    el.classList.add(val.trim());
                }

            });
            return this;
        };

        //Funcion para quitar Clases
        this.qtrCls = function (val) {

            this.forEach(function (el) {

                el.classList.remove(val);

            });
        };

        //Funcion para quitar atributos
        this.qtrAtr = function (attr) {
            this.forEach(function (el) {

                el.removeAttribute(attr);

            });
        };

        //Funcion para obtener el valor de un atributo
        this.obtAtr = function (attr) {
            if (this[0].hasAttribute(attr)) {
                return this[0].getAttribute(attr).trim();
            }
            return false;
        };

        this.forEach = function (fn) {

            if (!fn) {
                return null;
            }
            if (!this.length) {
                return null;
            }

            for (var a = 0; a < this.length; a++) {

                fn(this[a]);

            }
        };

        this.foco = function () {
            if (this[0]) {
                this[0].focus();
            } else {
                document.body.focus();
            }

        };

        this.value = function (value) {
            this.forEach(function (e) {
                if (e.value) {
                    e.value = value;
                }
            });
        };

        //Funciones privadas de la clase
        function _verOcultar(ele, val) {

            //Elementos html, nodelist
            if (val === "ver") {
                if (ele instanceof HTMLElement) {
                    ele.classList.add('selected');
                    return true;
                } else {
                    ele.forEach(function (item) {
                        item.classList.add("selected");
                    });
                    return true;
                }
                return false;
            }
            if (val === "ocultar") {
                if (ele instanceof HTMLElement) {
                    ele.classList.remove('selected');
                    return true;
                } else {
                    ele.forEach(function (item) {
                        item.classList.remove("selected");
                    });
                    return true;
                }
                return false;
            }

            if (ele instanceof HTMLElement) {
                ele.classList.contains('selected') ? ele.classList.remove('selected') :
                    ele.classList.add('selected');
                return true;
            } else {
                ele.forEach(function (item) {
                    item.classList.contains('selected') ? item.classList.remove('selected') :
                        item.classList.add('selected');
                    return true;
                });
            }

            return false;

        }
    }

    js.ajax = function (o) {

        var xmlHttpOject = getXmlHttp();
        var metodo = o.metodo || "GET";
        var formulario = o.formulario || false;
        var url = o.url;
        var respuesta = o.res;
        var cabeceraPeticion = o.cabeceraPeticion || "Content-type";
        var cabeceraPeticionValor = o.cabeceraPeticionValor || "application/x-www-form-urlencoded";
        var validar = o.validar || "";
        var contexto = "";
        var serializarForm = o.serializarForm || false;
        var data = o.data || "";
        var tipoRespuesta = o.tipoRespuesta || "responseText";
        var condicional = o.condicional;
        var datos = "";

        function proceso() {

            if (!valida()) {
                var valores = validar.split(",");
                var campos = "";
                if (valores.length > 0) {
                    for (var a = 0; a < valores.length; a++) {
                        campos += " " + valores[a];
                    }
                }
                console.log("Los campos <br> [ " + campos + " ] <br> Son obligatorios");
                return false;
            }

            datos = data;
            if (serializarForm) {
                datos = serializar();
                datos += data;
            }

            if (xmlHttpOject.readyState == 0 || xmlHttpOject.readyState == 4) {
                xmlHttpOject.onreadystatechange = response;

                if (metodo.toUpperCase() == "POST") {
                    xmlHttpOject.open(metodo, url, true);
                    xmlHttpOject.setRequestHeader(cabeceraPeticion, cabeceraPeticionValor);
                    xmlHttpOject.send(datos);
                } else {
                    xmlHttpOject.open(metodo, url + "?" + datos, true);
                    xmlHttpOject.setRequestHeader(cabeceraPeticion, cabeceraPeticionValor);
                    xmlHttpOject.send();
                }
                return true;
            }
            setTimeout(proceso, 1000);
        }

        function response() {
            if (xmlHttpOject.readyState == 4) {
                if (xmlHttpOject.status == 200) {
                    respuesta(xmlHttpOject.responseText);
                }
            }
        }

        function getXmlHttp() {

            var xmlhttp = new XMLHttpRequest();
            if (xmlhttp) {
                return xmlhttp;
            }
            if (window.ActiveXOject) {
                try {

                    xmlhttp = new ActiveXObject("MSXML2.XMLHTTP.6.0");
                    if (xmlhttp) {
                        return xmlhttp;
                    }
                    xmlhttp = new ActiveXObject("MSXML2.XMLHTTP.5.0");
                    if (xmlhttp) {
                        return xmlhttp;
                    }
                    xmlhttp = new ActiveXObject("MSXML2.XMLHTTP.4.0");
                    if (xmlhttp) {
                        return xmlhttp;
                    }
                    xmlhttp = new ActiveXObject("MSXML2.XMLHTTP.3.0");
                    if (xmlhttp) {
                        return xmlhttp;
                    }
                    xmlhttp = new ActiveXObject("MSXML2.XMLHTTP");
                    if (xmlhttp) {
                        return xmlhttp;
                    }
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    if (xmlhttp) {
                        return xmlhttp;
                    }

                } catch (e) {
                }
            }
        }

        function valida() {
            var res = true;

            if (!respuesta)
                res = false;
            if (!url)
                res = false;

            // Si se colocó campo de validacion
            if (validar !== undefined && validar !== "") {

                //Mas de un campo

                if (validar.indexOf(",")) {
                    var valores = validar.split(",");

                    for (var i = 0; i < valores.length; i++) {
                        if (document.forms[formulario][valores[i]].value == "") {
                            res = false;
                            //console.log(valores[i]);
                            document.forms[formulario][valores[i]].required = true;
                        }
                    }

                } else {
                    if (document.forms[formulario][validar].value == "") {
                        res = false;
                        document.forms[formulario][validar].required = true;
                    }
                }
            }

            return res;
        }
        function serializar() {
            var d = "";

            var x = formulario;

            for (var i = 0; i < x.length; i++) {

                d += x[i].name + "=";

                if (x[i].type == "checkbox") {
                    d += x[i].checked + "&";
                } else {
                    d += x[i].value + "&";
                }

            }
            //console.log(d);
            return d;
        }

        return proceso();
    };

    var formatopts = { pais: '' };

    js.fortmatOptions = function (obj) {
        for (var pro in obj) {
            formatopts[pro] = obj[pro];
        }
    };

    js.dataObject = function (dataset) {
        return Object.assign({}, dataset);
    }

    js.format = function (obj) {

        var data;
        var pais = formatopts.pais;

        if (!pais) {
            return obj.value;
        }

        switch (obj.formatopt) {
            case "percent":
                var option = { style: "percent" };
                var number = new Number(obj.value);
                if (number > 0) {
                    number = number / 100;
                }
                data = number.toLocaleString(pais.lang, option);
                break;
            case "numeric":
                var number = new Number(obj.value);
                // var number = new Intl.NumberFormat('en-US', {minimunFractionDigits: 2});               
                data = number.toLocaleString('en-US');
                // data = number.format(obj.value);

                break;
            case "decimal":
                var number = new Number(obj.value);
                // var number = new Intl.NumberFormat('en-US', {minimunFractionDigits: 2});               
                data = number.toLocaleString('en-US', { style: "currency", currency: "RDO" }).replace("RDO", "");
                // data = number.format(obj.value);

                break;
            case "currency":
                var option = { style: "currency", currency: pais.currency };
                var number = new Number(obj.value);
                data = number.toLocaleString(pais.lang, option);
                break;
            case "date":
                var option = { year: "numeric", month: "numeric", day: "numeric" };
                var date = new Date(obj.value.trim());
                data = date.toLocaleDateString(pais.lang, option);
                break;
            case "uppercase":
                data = obj.value.toUpperCase();
                break;
            case "lowercase":
                data = obj.value.toLowerCase();
                break;
            default:
                data = obj.value;
                break;
        }

        return data;

    };

    js.hoy = function () {
        var date = new Date();
        return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    };

    js.id = function () {

        return Math.random().toString(36).substr(2) + (new Date()).getTime().toString(36);

        //var d = new Date();
        //return (d.getYear() + d.getMonth() + d.getDay() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds());
    };
    js.get = function (objAjax) {
        var respuesta = "";
        objAjax.metodo = "GET";
        objAjax.res = function (res) {
            return res;
        };
        js.ajax(objAjax);
    };

    js.mensaje = function (obj) {

        var elem = htmlEl("div").setHTML(obj.texto).setClass("message " + obj.tipo).getHTML();
        var message_panel = document.getElementById("message_panel");

        js(elem).VerOcultar();

        if (message_panel) {
            message_panel.appendChild(elem);
        } else {
            document.body.appendChild(elem);
        }

        setTimeout(removeMSJ, 9000);
        setTimeout(ocultarMSJ, 8000);

        function ocultarMSJ() {
            js(elem).VerOcultar();
        }

        function removeMSJ() {
            if (message_panel) {
                message_panel.removeChild(elem);
            } else {
                document.body.removeChild(elem);
            }
            if (message_panel && message_panel.childNodes.length == 0) {
                js(message_panel).VerOcultar("ocultar");
            }

        }
    };

    js.clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };

    js.create = function (objectToCopy) {

        var objCopy = {};

        for (var property in objectToCopy) {

            if (objectToCopy[property] instanceof Array) {
                objCopy[property] = [];
            } else if (objectToCopy[property] instanceof Object) {
                objCopy[property] = {};
            } else {
                objCopy[property] = objectToCopy[property];
            }

        }
        return objCopy;
    }

    js.print = function (obj) {
        if (console && console.log) {
            console.log(obj);
        }
    };


    //Mutation

    js.Observer = function (objToObserve, config, callback) {

        var observer = new MutationObserver(callback);
        observer.observe(objToObserve, config);

    };


    //SystemTemplate

    js.getTemplate = function (htmlElemet) {

        js.print(templateBuilder(htmlElemet));

        function templateBuilder(el) {

            var template = "";

            if (el instanceof Text) {

                template = el.data.trim();

                return template;

            }

            if (el instanceof HTMLElement) {


                template = `\nhtml(\"${el.tagName.toLowerCase()}\")`;
                template += propertiesBuilder(el);

                //js.print({el: el});
                //js.print(el.childNodes);

                if (el.childNodes.length === 1) {

                    var child = templateBuilder(el.childNodes[0]);

                    if (child.length > 0) {
                        template += `.setHTML(\"${child}\")`;

                    }

                    return template;

                }

                var result = [];

                el.childNodes.forEach(function (child) {

                    if (child instanceof Text) {
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

            if (el.tagName === "svg") {
                template = el.outerHTML.replaceAll("\"", "\\\"").replaceAll("<", "\"<").replaceAll(">", ">\"+");
                template = template.slice(0, template.length - 1);

            }

            return template;

        }

        function propertiesBuilder(el) {

            var properties = "";

            if (!el instanceof HTMLElement) {
                return properties;
            }

            if (el.id.trim().length > 0) {

                properties += `.setId(\"${el.id}\")`;
            }

            if (el.className.trim().length > 0) {
                properties += `.setClass(\"${el.className}\")`;

            }

            if (el.type) {
                properties += `\n.setAttr(\"type\",\"${el.type}\")`;

            }

            if (el.name) {
                properties += `\n.setAttr(\"name\",\"${el.name}\")`;

            }

            if (el.tabindex) {
                properties += `\n.setAttr(\"tabindex\",\"${el.tabindex}\")`;

            }

            for (var dataproperty in el.dataset) {

                if (dataproperty !== "systemtemplate") {
                    properties += dataPropertyBuilder(dataproperty, el.dataset);
                }
            }


            return properties;

        }

        function dataPropertyBuilder(property, data) {

            switch (property) {

                case "binding":
                    return `\n.setBinding(\"${data[property]}\")`;
                case "addclass":
                    return `\n.setDataAddClass(\"${data[property]}\")`;
                case "dataValue":
                    return `\n.setValue(\"${data[property]}\")`;
                case "system":
                    return `\n.setSystem(\"${data[property]}\")`;
                case "dataText":
                    return `\n.setDataText(\"${data[property]}\")`;
                case "dataId":
                    return `\n.setDataId(\"${data[property]}\")`;
                case "targetid":
                    return `\n.setDataTargetId(\"${data[property]}\")`;
                case "targetactionid":
                    return `\n.setDataTargetActionId(\"${data[property]}\")`;
                case "formatid":
                    return `\n.setDataFormatId(\"${data[property]}\")`;
                case "targetthisid":
                    return `\n.setDataTargetThisId(\"${data[property]}\")`;
                case "targettab":
                    return `\n.setDataTargetTab(\"${data[property]}\")`;
                case "tabclose":
                    return `\n.setDataTabClose(\"${data[property]}\")`;
                case "index":
                    return `\n.setDataIndex(\"${data[property]}\")`;
                case "indexparam":
                    return `\n.setDataIndexParam(\"${data[property]}\")`;
                case "indexparam":
                    return `\n.setDataIndexParam(\"${data[property]}\")`;
                case "order":
                    return `\n.setDataOrder(\"${data[property]}\")`;
                case "format":
                    return `\n.setDataFormat(\"${data[property]}\")`;
                case "entidad":
                    return `\n.setDataEntidad(\"${data[property]}\")`;
                case "table":
                    return `\n.setDataTable(\"${data[property]}\")`;
                case "tableheaders":
                    return `\n.setDataTableHeaders(\"${data[property]}\")`;
                case "tablecontent":
                    return `\n.setDataTableContent(\"${data[property]}\")`;
                case "modelo":
                    return `\n.setDataModelo(\"${data[property]}\")`;
                case "template":
                    return `\n.setDataTemplate(\"${data[property]}\")`;
                case "view":
                    return `\n.setDataView(\"${data[property]}\")`;
                case "section":
                    return `\n.setSection(\"${data[property]}\")`;
                default:
                    return `\n.setAttr(\"data-${property}\",\"${data[property]}\")`;
            }
        }


    };

    //FileSlicers
    js.fileSlicers = function (fileList = null, fn) {

        var result;

        if (fileList) {
            result = fileList.map((file) => {

                return new FileSlicer(file, fn);

            });

        }
        return result;

    };

    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

    Array.prototype.buscar = function (obj) {

        var el = null;

        this.forEach(function (item) {

            var esta = true;

            if (item instanceof Array) {

                if (obj.value != null && obj.index != null) {

                    if (item[obj.index] === obj.value) {

                        el = item;

                        return;
                    }
                }

            } else if (typeof (item) === typeof ({})) {
                for (var it in obj) {
                    if (item[it] != obj[it]) {
                        esta = false;
                        return;
                    }
                }
                if (esta) {
                    el = item;
                    return;
                }

            } else {
                if (item == obj)
                    el = true;
            }
        });

        return el;
    };

    var forEach = function (fn) {
        if (!fn) {
            return null;
        }
        if (!this.length) {
            return null;
        }

        for (var i = 0; i < this.length; i++) {

            fn(this[i]);

        }
    };


    var concat = function (array) {

        if (!array) {
            return null;
        }

        for (var i = 0; i < array.length; i++) {

            this.push(array[i]);

        }

    };

    if (Array.prototype.concat === undefined) {
        Array.prototype.concat = concat;
    }
    if (Array.prototype.forEach === undefined) {
        Array.prototype.forEach = forEach;
    }

    if (NodeList.prototype.forEach === undefined) {
        NodeList.prototype.forEach = forEach;
    }

    if (FileList.prototype.concat === undefined) {

        FileList.prototype.concat = concat;

    }

    if (FileList.prototype.forEach === undefined) {

        FileList.prototype.forEach = forEach;

    }

    /*if (FileList.prototype.map === undefined) {
     
     FileList.prototype.map = map;
     
     }*/

    if (String.prototype.startsWith === undefined) {
        String.prototype.startsWith = function (value) {
            return this.substr(0, value.length) === value;
        };
    }

    if (typeof (window.js) === "undefined") {
        window.js = js;
    }

    function FileSlicer(file, fn) {

        var dataCallback = fn;

        var reader = new FileReader();

        var data = [];

        reader.onload = (evt) => {

            data = evt.target.result.split("\r\n");

            this.firesData();

        };

        this.fileName = file.name;
        this.file = file;
        this.currentRecords = 0;
        this.progress = 0;
        this.records = 0;
        this.status = "";

        this.hasRecords = function () {

            return (data.length > this.currentRecords);
        };

        this.getData = function (records = 50) {

            this.records = records;
            this.firesData();

        };

        this.firesData = function () {

            if (data.length <= this.currentRecords) {

                return;
            }

            let starts = this.currentRecords;
            let ends = Math.min(this.currentRecords + this.records, data.length);

            let ratio = ends / data.length;

            this.progress = isNaN(ratio) ? 0 * 100 : ratio * 100;

            let result = { fileName: file.name, total: data.length, portion: ends, data: data.slice(starts, ends).join(",") };

            this.currentRecords += this.records;

            if (dataCallback) {
                dataCallback(result);
            }

        };

        this.data = function () {

            let starts = this.currentRecords;
            let ends = Math.min(this.currentRecords + this.records, data.length);

            let result = { fileName: file.name, total: data.length, portion: ends, data: data.slice(starts, ends).join(",") };
            return result;
        };


        reader.readAsBinaryString(file);

    }

})();
