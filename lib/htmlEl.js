/* 
 * Creacion de elementos HTML Para Plantillas
 */


"use strict";

(function () {

    var htmlEl = function (el) {
        return new elemento(el);
    };

    function elemento(tag) {

        var elem = {};

        if (tag) {
            
            elem = document.createElement(tag);

        

        } else {
            elem = document.createElement("div");
        }

        this.setClass = function (clases) {
            if (elem instanceof HTMLElement) {
                elem.className = clases;
            }
            return this;
        };


        this.setId = function (id) {
            if (elem instanceof HTMLElement) {
                elem.id = id;
            }
            return this;
        };

        this.setDataAddClass = function (clases) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-addclass", clases);
            }
            return this;
        };

        this.setDataValue = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-value", value);
            }
            return this;
        };

        this.setValue = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("value", value);
            }
            return this;
        };

        this.setSystem = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-system", value);
            }
            return this;
        };

        this.setController = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-controller", JSON.stringify(value));              
            }
            return this;
        };

        this.setBinding = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-binding", JSON.stringify(value));
            }
            return this;
        };

        this.setDataText = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-text", value);
            }
            return this;
        };

        this.setDataId = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-id", value);
            }
            return this;
        };

        this.setDataTargetId = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-targetid", value);
            }
            return this;
        };

        this.setDataTargetActionId = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-targetactionid", value);
            }
            return this;
        };

        this.setDataFormatId = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-formatid", value);
            }
            return this;
        };

        this.setDataTargetThisId = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-targetthisid", value);
            }
            return this;
        };

        this.setDataTargetTab = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-targettab", value);
            }
            return this;
        };

        this.setDataTabClose = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-tabclose", value);
            }
            return this;
        };

        this.setDataIndex = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-index", value);
            }
            return this;
        };
        this.setDataIndexParam = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-indexparam", value);
            }
            return this;
        };
        this.setDataOrder = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-order", value);
            }
            return this;
        };

        this.setDataFormat = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-format", value);
            }
            return this;
        };

        this.setDataEntidad = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-entidad", value);
            }
            return this;
        };
        this.setDataTable = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-table", value);
            }
            return this;
        };
        this.setDataTableHeaders = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-tableheaders", value);
            }
            return this;
        };
        this.setDataTableContent = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-tablecontent", value);
            }
            return this;
        };
        this.setDataModelo = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-modelo", value);
            }
            return this;
        };
        this.setDataTemplate = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-template", value);
            }
            return this;
        };

        this.setDataView = function (value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute("data-view", value);
            }
            return this;
        };
        this.setAttr = function (attr, value) {
            if (elem instanceof HTMLElement) {
                elem.setAttribute(attr, value);
            }
            return this;
        };

        this.setText = function (text) {
            if (elem instanceof HTMLElement) {
                elem.innerTEXT = text;
            }
            return this;
        };

        this.setHTML = function (html) {
            if (elem instanceof HTMLElement) {
                if (html instanceof elemento) {
                    elem.appendChild(html.getHTML());
                } else if (html instanceof HTMLElement) {
                    elem.appendChild(html);
                } else if (html instanceof Array) {
                    html.forEach(function (el) {
                        elem.appendChild(el.getHTML());
                    });
                } else if (typeof (html) == typeof ("")) {
                    elem.innerHTML = html;
                }
            }
            return this;
        };
        this.getHTML = function () {
            return elem.cloneNode(true);
        };
        return this;
    }

    if (typeof (window.htmlEl) === "undefined")
        window.htmlEl = htmlEl;
})();