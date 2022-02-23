export function renderSys(htmlElemet, presenter) {
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
  event: (el, eventListener, presenter) => {},
  submit: (el, eventListener, presenter) => {
    el.addEventListener("submit", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      console.log(evt.target.action.split("/"));
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
};
