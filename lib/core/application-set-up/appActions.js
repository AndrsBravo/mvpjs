export const appActions = {
  alert: () => {
    console.log("LLega el alert");
    window.alert(
      "Este mensaje es para probar la funcion click de estecomponente"
    );
  },

  actionleft: (el) => {
    js(el.dataset.actionleft).Moveleft();
  },

  actionright: (el) => {
    js(el.dataset.actionright).Moveright();
  },

  targetclose: (el) => {
    el.dataset.targetclose.split(",").forEach(function (e) {
      js(e).Ocultar();
    });
  },

  tabclose: (el) => {
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
        js.print(
          Array.prototype.indexOf.call(parentNode.children, elementheader)
        );
        var index = Array.prototype.indexOf.call(
          parentNode.children,
          elementheader
        );

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
  },

  tab: (el) => {
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
  },

  clearvalue: (el) => {
    el.dataset.clearvalue.split(",").forEach(function (sel) {
      js(sel).value("");
      js(sel).foco();
    });
  },

  pop: (el) => {
    //js.print("Se lanza el pop");
    //js.print(setController);
    currentController.pop();
  },

  target: (el) => {
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
  },

  selectthis: (el) => {
    js(el).targetThis();
  },

  targetthis: (el) => {
    js(el.dataset.targetthis).targetThis();
  },

  selectable: (el) => {
    js(el).VerOcultar();
    js.print("El selectable del elemonto unico");
    js.print(el);
  },

  formview: async (el) => {
    const { System } = await Import("system");

    System.formview(el);
  },

  controller: async (el) => {
    const { setController } = await Import("setController");
    setController(el);
  },

  focus: (el) => {
    el.dataset.focus.split(",").forEach(function (sel) {
      js(sel).foco();
    });
  },
};

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
