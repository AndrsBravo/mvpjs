"use strict";
function WebSocketApplication(appSettings) {

    var settings = appSettings;
    var websocket;
    var notificationHandler;
    var messageHandler;
    var readyStateNotificationHandler;
    var holeTime = 120000;
    var testTime = holeTime;

    function onopen(evt) {
        //console.log("Open");
        settings.estatus = 0;
        settings.open = 1;
        //  conectar();
        fireReadyStateNotificationHandler({tipo: "open"});
    }

    function onclose(message) {
        //js.print("Se cierra la conexion y dice");
        //js.print(message);
        settings.open = 0;
        fireReadyStateNotificationHandler({tipo: "close"});
    }
    function onmessage(message) {
        mensaje(JSON.parse(message.data));
    }

    function onerror(error) {
        notify({tipo: "err", texto: "El error es " + error.toLocaleString()});
        // notify({tipo: "err", texto: "cliente - Error"});
        fireReadyStateNotificationHandler({tipo: "error"});
    }

    function fireReadyStateNotificationHandler(obj) {
        if (readyStateNotificationHandler !== undefined) {
            readyStateNotificationHandler(obj);
        }
    }

    this.setReadyStateNotificationHandler = function (fn) {
        readyStateNotificationHandler = fn;
    };

    this.wsTest = function (time) {

        testTime -= 1000 > time ? 1000 : time;

        js.print("--- el timeTest " + testTime);
        if (testTime <= 0) {
            js.print("--- Test de la conexion WS");
            fireReadyStateNotificationHandler({tipo: "wsTest"});
        }
    };

    this.wsOpen = function () {

        js.print("Se habilita el open");

        if (settings.url) {
            try {
                websocket = new WebSocket(settings.url.trim());
                websocket.onopen = onopen;
                websocket.onclose = onclose;
                websocket.onmessage = onmessage;
                websocket.onerror = onerror;
            } catch (e) {
                notify({tipo: "err", texto: e.toString()});
            }
        }
    };

    this.setMessageHandler = function (handler) {
        messageHandler = handler;
    };

    function mensaje(message) {
        if (messageHandler !== undefined) {
            messageHandler(message);
        }
    }

    this.Enviar = function (paquete) {
        enviar(paquete);
    };
    function enviar(paquete) {
        //js.print("El paquete a enviar");
        //js.print(paquete);
        //js.print("El estatus en ambos");
        //js.print(settings.estatus + " " + websocket.readyState);
        if (settings.estatus === 1 || websocket.readyState === 1)
        {
            if (paquete) {
                try {

                    websocket.send(JSON.stringify(paquete).trim());
                    testTime = holeTime;
                } catch (e) {
                    js.print("Se produce un error al enviar el paquete");
                    js.print(e);

                }
            }
        } else {
            //   conectar();
            //js.print("El estado de la conexion es " + websocket.readyState);
            notify({tipo: "adv", texto: "El estado de la conexion es " + websocket.readyState});
        }
    }

    this.setNotificationHandler = function (nh) {
        notificationHandler = nh;
    };

    /* function conectar() {
     //console.log("conectar");
     //console.log(settings.connectionpackage);
     if (!settings.connectionpackage)
     return null;
     
     try
     {
     enviar(settings.connectionpackage);
     } catch (e) {
     notify({tipo: "err", texto: e});
     }
     }*/

    function notify(obj) {
        if (notificationHandler !== undefined) {
            notificationHandler(obj);
        }
    }
}
