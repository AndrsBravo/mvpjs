export default async function(htmlElemet) {

    // const datatargetclose = htmlElemet.querySelectorAll("[has(data-sys-)]");
    //console.log(datatargetclose[0].dataset);

    //console.log("desde setUpSystemComponent");

    setUp(htmlElemet);

    const events = htmlElemet.querySelectorAll("*[event]");
    const c_events = htmlElemet.querySelectorAll("*[c-event]");
    const htmlElementsToResize = htmlElemet.querySelectorAll("*[resize]");
    const dataSystemTempalte = htmlElemet.querySelectorAll("*[build-template]");
    const htmlElementWithdropZone = htmlElemet.querySelectorAll("*[dropzone]");


    events.forEach(element => setUp(element));

    c_events.forEach(element => setUp(element));

    htmlElementsToResize.forEach(element => setUp(element));

    dataSystemTempalte.forEach(element => setUp(element));

    htmlElementWithdropZone.forEach(element => setUp(element));

}


async function setUp(htmlElement) {

    //Add Event Listener to the HTMLElement 
    if (htmlElement.matches("[event]")) {

        const { addEventListener } = await Import("event");

        addEventListener(htmlElement);

    }

    //Add custom Event Listener
    if (htmlElement.matches("[c-event]")) {

        const { default: customEvent } = await Import(htmlElement.getAttribute("c-event"));

        htmlElement.addEventListener(htmlElement.getAttribute("c-event"), customEvent);

        // customEvent(htmlElement);
    }


    //Add event Listeners for Resizing elements
    if (htmlElement.matches("[resize]")) {

        const { resize } = await Import("resize");

        resize(htmlElement);
    }


    //Generate template from html format
    if (htmlElement.matches("[build-template]")) {

        const { systemTemplate } = await Import("systemTemplate");
        systemTemplate(htmlElement);

    }

    //Add Event Listener Drop zone
    if (htmlElement.matches("dropzone")) {
        const { dropZone } = await Import("dropzone");
        dropZone(htmlElement);
    }

}