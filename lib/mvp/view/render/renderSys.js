import System from "../../../core/system/System.js";
export function renderSys(htmlElemet, presenter) {

  if (htmlElemet.matches("a[href]")) { event(htmlElemet); }
  var href = htmlElemet.querySelectorAll("a[href]");

  href.forEach((el) => {
    if (el.href.length < 1) {
      console.log("Link sin direccion");
      console.log(el);
      return;
    }
    event(el);
  });


  function event(el) {
    el.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      System.route(evt.currentTarget.href);
    });
  }

  for (const property in htmlElemet.dataset) {
    if (
      Object.hasOwnProperty.call(htmlElemet.dataset, property) &&
      property.startsWith("sys") &&
      sysRenderStrategy[property]
    ) {
      sysRenderStrategy[property](htmlElemet, presenter);
    }
  }

  const events = htmlElemet.querySelectorAll("*[data-sys-event]");
  events.forEach((element) =>
    sysRenderStrategy["sysEvent"](element, presenter)
  );
}

const sysRenderStrategy = {
  sysEvent: (el, presenter) => {
    const events = el.dataset.sysEvent.split(";");
    events.forEach((event) =>
      sysRenderStrategy["callEvent"](event, el, presenter)
    );
  },
  callEvent: (event, el, presenter) => {
    const [handler, callback] = event.split(":");
    if (handler && eventHandlers[handler]) {
      eventHandlers[handler](el, callback, presenter);
    }
  },
};

const eventHandlers = {
  event: (el, eventListener, presenter) => { },
  submit: (el, eventListener, presenter) => {
    el.addEventListener("submit", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      //  console.log(evt.target.action.split("/"));
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

      if (!presenter[eventListener]) {
        return;
      }
      presenter[eventListener](evt.target);
    });
  },
};
