export async function setController(el) {

    if (!el.dataset.controller || el.dataset.controller.length < 1) return;


    js.print("Estan los controllers");
    js.print(el.dataset.controller);


    const contArrayStr = el.dataset.controller.split(";");

    const contArrayObjects = contArrayStr.map(controller => {

        const controllerAndFilter = controller.split(":");

        return { controller: controllerAndFilter[0], filter: controllerAndFilter[1] };

    });

    console.log(contArrayObjects);

    if (!contArrayObjects);

    const controladores = contArrayObjects.map(async controller => {

        const { default: controllerClass } = await Import(controller.controller);
        return new controllerClass();


    });

    const { System } = await Import("system");
    const { getContext } = await Import("getContext");

    System.action(controladores, getContext(el));

    //setControllers(controllersLoaded, el, evt);


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
