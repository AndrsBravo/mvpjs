import System from "../../../core/system/System.js";
export default function (htmlElemet, presenter) {

  if (htmlElemet.matches("a[href]")) { eventHandlers["link"](htmlElemet); }
  var href = htmlElemet.querySelectorAll("a[href]");

  href.forEach((el) => {
    if (el.href.length < 1) {
      console.log("Link sin direccion");
      console.log(el);
      return;
    }
    eventHandlers["link"](el);
  });

  if (htmlElemet.matches("[data-on]")) {
    sysRenderStrategy(element, presenter)
  }
  const events = htmlElemet.querySelectorAll("*[data-on]");
  events.forEach((element) => { sysRenderStrategy(element, presenter); });
}

const sysRenderStrategy = (el, presenter) => {

  for (const property in el.dataset) {

    if (!property.startsWith("on")) continue
    if (property.replace("on", "").length < 1) continue
    const event = property.replace("on", "");

    if (eventHandlers[event]) { eventHandlers[event](el, el.dataset[property], presenter); continue; }

    eventHandlers["event"](el, el.dataset[property], presenter);

  }

};

const eventHandlers = {
  event: (el, eventListener, presenter) => {
    el.addEventListener(eventListener, (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!presenter[eventListener]) {
        return;
      }
      presenter[eventListener](evt.target);
    });
  },
  link: (el) => {
    el.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      System.route(evt.currentTarget.href);
    });
  },
  submit: (el, eventListener, presenter) => {
    el.addEventListener("submit", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (!evt.target.action) {
        return;
      }
      if (!presenter[eventListener]) {
        return;
      }

      const formData = new FormData(evt.target);

      const data = {};

      for (const entry of formData.entries()) {
        data[entry[0]] = entry[1];
      }

      presenter[eventListener](data, evt.target);
    });
  },
  click: (el, eventListener, presenter) => {
    el.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!presenter[eventListener]) { return; }
      presenter[eventListener](evt.currentTarget);
    });
  },
  drop: (el, eventListener, presenter) => {


    ["dragenter", "dragleave"].forEach(function (eventName) {
      el.addEventListener(eventName, function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        evt.currentTarget.classList.remove("drag-over");
      }, false);
    });

    el.addEventListener("dragover", function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.currentTarget.classList.add("drag-over");
    }, false);

    el.addEventListener("drop", function (evt) {

      evt.preventDefault();
      evt.stopPropagation();

      const target = evt.currentTarget;
      target.classList.remove("drag-over");

      const dataTransfer = new DataTransfer();
      var inputFile = el.querySelector("input[type=file]");

      Array.from(evt.dataTransfer.files).forEach(file => algo(file));

      function algo(file) {

        if (!inputFile) {
          return;
        }

        if (inputFile.accept) {

          inputFile.accept.split(",").forEach((extencion) => {

            if (file.name.endsWith(extencion)) {
              dataTransfer.items.add(file)
            }
          });
        }
        inputFile.files = dataTransfer.files;
      }

      console.log(dataTransfer);
      if (!presenter[eventListener]) { return; }
      presenter[eventListener](evt.dataTransfer, target, evt);

    }, false);


  },
  change: (el, eventListener, presenter) => {

    if (!presenter[eventListener]) return;

    const eventHandlers = {

      default: evt => { presenter[eventListener]({ value: evt.currentTarget.value }, evt.currentTarget, evt); },
      file: evt => { presenter[eventListener](evt.currentTarget.files, evt.currentTarget, evt); }

    }

    let eventHandler = eventHandlers[el.type];

    if (!eventHandler) eventHandler = eventHandlers["default"];

    el.addEventListener("change", eventHandler);

   
  }
};
