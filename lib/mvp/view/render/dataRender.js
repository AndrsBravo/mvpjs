const dataRender = {
  href: (el, item) => {
    if (el.href.indexOf("{") > 0 && el.href.indexOf("}") > 0) {
      const result = el.href.split("{").reduce((acum, value) => {
        const index = value.indexOf("}");
        if (index > -1) {
          acum.push(value.substr(0, index));
        }
        return acum;
      }, []);

      if (result) {
        result.forEach((value) => {
          el.href = el.href.replace(
            `\{${value}\}`,
            dataRender["data"](item, value.split("."))
          );
        });
      }

      return;
    }

    const result = el.href.split("%7B").reduce((acum, value) => {
      const index = value.indexOf("%7D");
      if (index > -1) {
        acum.push(value.substr(0, index));
      }
      return acum;
    }, []);
    if (result) {
      result.forEach((value) => {
        el.href = el.href.replace(
          `\%7B${value}\%7D`,
          dataRender["data"](item, value.split("."))
        );
      });
    }
  },
  dataText: (el, item) =>
    (el.innerText = dataRender["data"](item, el.dataset.dataText.split("."))),
  dataValue: (el, item) =>
    (el.value = dataRender["data"](item, el.dataset.dataValue.split("."))),
  dataId: (el, item) =>
    (el.id = dataRender["data"](item, el.dataset.dataId.split("."))),

  bind: (el, item, bindId) => {
    if (!el.dataset.bind || !bindId) {
      return;
    }

    el.addEventListener(el.dataset.bind, (evt) => {
      console.log("Llego");
      dataRender["tada"](item, el.dataset.dataValue.split("."), el.value);
    });
  },

  data: (item, properties) => {
    var data = item;
    properties.forEach((property) => (data = data[property]));
    return data;
  },
  tada: (item, properties, value) => {
    var data = item;

    for (let index = 0; index < properties.length; index++) {
      if (properties.length === index + 1) {
        data[properties[index]] = value;
        return;
      }

      data = data[properties[index]];
    }
  },
};

export default dataRender;

/*
el.addEventListener("click", evt => {
    evt.preventDefault();

    console.log(evt.target);
    history.pushState(null, '', evt.target.href);
});*/
