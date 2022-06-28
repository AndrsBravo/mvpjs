const dataRender = {

  id: (el, item) => { 

    let id = el.id;
    console.log("Llamando al id mio",el.id);

    while (id.indexOf("{") > -1 || id.indexOf("}") > -1) {
      var property = /{([^}]+)}/.exec(id);
      let result = dataRender["data"](item, property[1].split("."));
      
      if(result == null) result = "";
      if(result instanceof Array) result = result.join(" ");

      id = id.replaceAll(
        property[0],
        result
      );
    }

    el.id = id;
    
   
  
  },

  class:(el, item) => {    
    let clases = el.className;

    while (clases.indexOf("{") > -1 || clases.indexOf("}") > -1) {
      var property = /{([^}]+)}/.exec(clases);
      let result = dataRender["data"](item, property[1].split("."));
      
      if(result == null) result = "";
      if(result instanceof Array) result = result.join(" ");

      clases = clases.replaceAll(
        property[0],
        result
      );
    }

    el.className = clases;
    },

  href: (el, item) => {
    let href = decodeURI(el.href);

    while (href.indexOf("{") > -1 || href.indexOf("}") > -1) {
      var algo = /{([^}]+)}/.exec(href);
      console.log(algo);
      href = href.replaceAll(
        algo[0],
        dataRender["data"](item, algo[1].split("."))
      );
    }

    el.href = href;
    console.log(href);
  },
  dataText: (el, item) =>
    (el.innerText = dataRender["data"](item, el.dataset.dataText.split("."))),
  dataValue: (el, item) =>
    (el.value = dataRender["data"](item, el.dataset.dataValue.split("."))),
 

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
