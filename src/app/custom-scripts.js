define(["dojo/topic", "esri/arcgis/utils", "esri/dijit/Print",
        "esri/tasks/PrintTemplate", "esri/config",
        "dojo/_base/array", "dojo/dom", "dojo/parser",
        "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!", "esri/map",
        "esri/dijit/BasemapToggle"],
    function (topic, arcgisUtils, Print, PrintTemplate, esriConfig, arrayUtils, dom, parser, Map, BasemapToggle) {

        /*
         * Custom Javascript to be executed while the application is initializing goes here
         */

        // The application is ready
        topic.subscribe("tpl-ready", function () {
            /*
             * Custom Javascript to be executed when the application is ready goes here
             */
            console.log("Map Journal is ready");
            console.log(app);
        });

        // When a section is being loaded (don't wait for the Main Stage media to be loaded)
        topic.subscribe("story-load-section", function (index) {
            console.log("The section", index, "is being loaded");
            switch (index) {
                case 0:
                case 5: {
                    $("#position-print-button").hide();
                    $("#print_button").hide();
                    break;
                }
                case 1:
                case 2 :
                case 3 :
                case 4: {
                    $("#position-print-button").show();
                    $("#print_button").show();
                    break;
                }
            }
        });

        // After a map is loaded (when the map starts to render)
        topic.subscribe("story-loaded-map", function (result) {
            console.log(app.map);

            // PRINT
            if (app.printer) {
                app.printer.destroy();
            }
            parser.parse();

            app.webmapId = app.mapItem.id;
            app.printUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";

            esriConfig.defaults.io.proxyUrl = "/proxy/";

            createPrintDijit();

            function createPrintDijit() {

                // create an array of objects that will be used to create print templates
                var layouts = [{
                    name: "Letter ANSI A Landscape",
                    label: "Landscape (PDF)",
                    format: "pdf",
                    options: {
                        legendLayers: [], // empty array means no legend
                        scalebarUnit: "Miles",
                        titleText: "Landscape PDF"
                    }
                }];

                // create the print templates
                var templates = arrayUtils.map(layouts, function (lo) {
                    var t = new PrintTemplate();
                    t.layout = lo.name;
                    t.label = lo.label;
                    t.format = lo.format;
                    t.layoutOptions = lo.options;
                    return t;
                });
                console.log(app.printUrl);

                app.printer = new Print({
                    map: app.map,
                    templates: templates,
                    url: app.printUrl
                }, dom.byId("print_button"));
                app.printer.startup();
            }

            if (result.index !== null)
                console.log("The map", result.id, "has been loaded from the section", result.index);
            else
                console.log("The map", result.id, "has been loaded from a Main Stage Action");
        });

        // When a main stage action that loads a new media or reconfigures the current media is performed
        // Note that this event is not fired for the "Locate an address or a place action"
        topic.subscribe("story-perform-action-media", function (media) {
            console.log("A Main Stage action is performed:", media);
        });
    });

