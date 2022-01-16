export function systemActionListener(systemaction) {

    js.print("3- Se lanza La action que ");
    js.print(systemaction);


    // Settings tab

    setAppTabs(systemaction);


    systemaction.presenters.forEach(function (controlador) {

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
        if (controlador.performState && systemaction.context.presenter !== "filterAction" && controlador.currentAction !== undefined) {
            system.sesion.setEstado(systemaction, controlador.currentAction);
        }

    });

}