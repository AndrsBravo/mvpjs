export async function mkAction(controllersList, context, timer) {

    // if (!System.prototype.sesion.isActiva()) {
    //     js.print("----- la Sesion en el cliente no esta activa ");
    // }

    let { System } = await Import("system");

    var action = System.getActions().find(action => action.actionid = context.actionid);

    js.print(" Ciclo de vida de una action ");

    if (!action || context.actionidvariable === "variable") {

        js.print(" 1- Se crea una action nueva");

        let { ActivityDataMutationObserver } = await Import("ActivityDataMutationObserver");
        console.log(ActivityDataMutationObserver);

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

    System.getActions().push(action);
    js.print(" 2- Se Adiciona al pool de actions");
    js.print(action);

    System.riseSystemAction(action);
    

    if (timer) {
        setTimeout(function () {
            actionTimeOut(action);
        }, timer);
    }
}