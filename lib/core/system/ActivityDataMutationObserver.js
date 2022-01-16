export class ActivityDataMutationObserver {

    #observers = [];

    process = [];
     constructor(){}

    change = (property, change) => {

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

    observer = (property = null, observer = null) => {

        if (property && observer)
            observers.push({ property: property, callback: observer });


    };

}