export function getContext(obj) {

    var target = obj;

    if (obj instanceof Event) {

        target = obj.currentTarget;

    }

    var newObjContext = {};

    if (target instanceof HTMLElement) {

        Object.assign(newObjContext, target.dataset);      

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
       

        if (target.event === "drop") {

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