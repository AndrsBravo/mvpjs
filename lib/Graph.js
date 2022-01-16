"use strict";
(function (js) {

    if (!js) {
        return;
    }

    var graphs = [];

    js.Graph = function (obj) {


        create(obj);


        function create(obj) {

            js.print("--- Se va a crear un halfdoughnut ---- ");

            var properties = obj.dataset;
            var config = js.clone(configs[properties.graph]);
            if (properties.graphTitulo) {
                config.options.title.text = properties.graphTitulo.toString().toUpperCase();
            }
            var graph = graphs.buscar({nombre: obj.id});

            if (!graph) {
                graph = {nombre: obj.id, tipo: properties.graph, config: config, graph: new Chart(obj.getContext('2d'), config), ratio: 0, ratioDes: ''};
                graphs.push(graph);
                return;
            }

            graph.config = config;
            graph.graph = Chart(obj.getContext('2d'), config);
            graphs.push(graph);

        }


        function doughnut(obj, analytic) {

        }
    };

    js.GraphSerie = function (obj, properties, analytic) {

        var graph = graphs.buscar({nombre: obj.id});
        if (!graph) {
            js.Graph(obj);
            graph = graphs.buscar({nombre: obj.id});
        }

        if (!graph) {
            return;
        }

        switch (graph.tipo) {
            case"halfdoughnut":
                halfdoughnut(graph, properties, analytic);
                break;
            case"line":
                line(graph, properties, analytic);
                break;
        }

        function halfdoughnut(graph, properties, analytic) {

            var config = graph.config;
            config.options.title.text = analytic[properties.graphTitulo].toString().toUpperCase();

            var data = analytic[properties.graphSerie];

            if (data) {

                var miDataset = {data: [], backgroundColor: []};

                data.forEach(function (dato) {
                    miDataset.data.push(Dato(dato[properties.graphDatapos], properties.graphData));
                    miDataset.backgroundColor.push(chartColors[colores[miDataset.data.length - 1]]);
                    config.data.labels.push(Dato(dato[properties.graphLabelspos], properties.graphLabels));

                });

                config.data.datasets.push(miDataset);

            } else {
                config.options.title.text = "No hay data que mostrar en el grafico";
            }

            function Dato(dato, propiedad) {
                if (typeof (dato) === typeof ({})) {
                    var estedato = dato;
                    propiedad.split(".").forEach(function (gd) {
                        estedato = estedato[gd];
                    });

                    return estedato;

                } else {
                    return dato;
                }
            }

            graph.graph.update();
        }
        function line(graph, properties, analytic) {

            var config = graph.config;
            if (properties.graphTitulo) {
                config.options.title.text = (properties.graphTitulo.toString() + ' ' + graph.ratioDes).toUpperCase();
            }

            /*Con esta variable setearemos los datos para no mostrar
             series incompletas en un rago de datos*/
            /* se crearan series de datos asi*/

            /* Forma incompleta*/ /*Forma completa*/
            /*  1   ###             1   ###
             *  2   #####           2   #####
             *  5   ####            3   000
             *                      4   000
             *                      5   #### 
             * */

            var datamask = [];
            var data = analytic[properties.graphSerie];
            if (!data) {
                return;
            }

            var setlabels = false;
            if (config.data.labels.length === 0) {
                setlabels = true;
            }

            //Setting de la data mask
            if (properties.graphMonthmask) {
                var mask = analytic[properties.graphMonthmask];
                if (mask instanceof Array) {

                    mask.forEach(function (mesvalue) {

                        //Setting config.data.labels
                        if (setlabels) {
                            config.data.labels.push(MONTHS[mesvalue - 1]);
                        }

                        //Setting de la mascara de datos
                        var dato = data.buscar({index: 0, value: mesvalue});


                        if (dato) {

                            setRatio({graph: graph, value: dato[properties.graphDatapos]});
                            datamask.push(dato[properties.graphDatapos] / graph.ratio);
                        } else {
                            datamask.push(0);
                        }


                    });
                } else {
                    if (setlabels) {
                        config.data.labels.push(MONTHS[mask - 1]);
                    }
                    datamask.push([mask, 0]);
                }
            }

            var miDataset = {label: analytic[properties.graphSerieNombre], data: datamask, backgroundColor: chartColors[colores[config.data.datasets.length]], borderColor: chartColors[colores[config.data.datasets.length]], fill: false};
            js.print("El graph to update");
            js.print(miDataset);
            js.print(graph);
            config.data.datasets.push(miDataset);
            graph.graph.update();

            function setRatio(obj) {

                if (obj.graph.config.data.datasets.length === 0) {
                    if (obj.value > 1000000000 && 1000000000 > obj.graph.ratio) {
                        obj.graph.ratio = 1000000000;
                        obj.graph.ratioDes = '(1mil millon)';
                    } else if (obj.value > 1000000 && 1000000 > obj.graph.ratio) {
                        obj.graph.ratio = 1000000;
                        obj.graph.ratioDes = '(1millon)';
                    } else if (obj.value > 1000 && 1000 > obj.graph.ratio) {
                        obj.graph.ratio = 1000;
                        obj.graph.ratioDes = '(1mil)';
                    } else if (obj.value < 1000 && obj.graph.ratio < 1) {
                        obj.graph.ratio = 1;
                        obj.graph.ratioDes = '(1)';
                    }
                }

            }
        }

        function doughnut(obj, analytic) {

        }
    };

    js.GraphReset = function () {
        graphs = [];
    };

    var chartColors = {

        green: '#06A29B',
        orange: 'rgb(255, 159, 64)',
        blue: 'rgb(0,48,155)',
        red: 'rgb(255, 99, 132)',
        mediumturquoise: 'rgb(78, 205, 196)',
        yellow: 'rgb(255, 205, 86)',
        skyblue: 'rgb(25, 181, 254)',
        purple: 'rgb(153, 102, 255)',
        greenjava: 'rgb(35, 203, 167)',
        grey: 'rgb(201, 203, 207)',
        dodgerblue: 'rgb(34, 167, 240)',
        orangecrusta: 'rgb(242, 120, 75)',
        caribbeangreen: 'rgb(3, 201, 169)',
        redcabaret: 'rgb(210, 82, 127)',
        royalblue: 'rgb(83, 51, 237)',
        redflory: 'rgb(241, 130, 141)',
        aquaisland: 'rgb(162, 222, 208)',
        white: 'rgb(255,255,255)'
    };

    var colores = Object.keys(chartColors);
    var MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    var configs = {

        doughnut: {

            type: 'doughnut',
            data: {
                datasets: [],
                labels: []
            },
            options: {
                responsive: true,
                legend: {
                    position: 'left'
                },
                title: {
                    display: true,
                    text: ''
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                circumference: 2 * Math.PI,
                rotation: -Math.PI / 2,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: chartColors.blue
                }
            }
        },

        halfdoughnut: {

            type: 'doughnut',
            data: {
                datasets: [],
                labels: []
            },
            options: {
                responsive: true,
                legend: {
                    position: 'left'
                },
                title: {
                    display: true,
                    text: ''
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                circumference: Math.PI,
                rotation: -Math.PI
                ,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: chartColors.gray
                }
            }
        },

        line: {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: chartColors.gray
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Mes'
                            }
                        }],
                    yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Monto'
                            }
                        }]
                }
            }
        }
    };

})(window.js);

