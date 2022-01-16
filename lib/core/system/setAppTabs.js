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