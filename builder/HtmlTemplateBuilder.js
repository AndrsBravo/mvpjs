function element(tagName) {

  if (!tagName) tagName = "template";

  const argsFormat = (args) => {

    const directive = () => typeof (args) == "string" ? args
      .replaceAll("{@@", "${meta.")
      .replaceAll("{@", "${data.")
      .replaceAll("{#", "${model.") : args;

    function setin(params) {

      let [key, value] = params.split(" in ");
      if (!value.includes("data.") && !value.includes("meta.")) value = `'${value}'`;
      return `{renderObject(${key},${value})}`;

    }

    function setof(params) {

      let [key, value] = params.split(" of ");
      if (!value.includes("data.") && !value.includes("meta.")) value = `'${value}'`;
      return `{renderArray(${key},${value})}`;
      //return `{renderArray(${params.replace(" of ", ",'")}')}`
    }

    function setas(params) {

      let [key, value] = params.split(" as ");
      if (!value.includes("data.") && !value.includes("meta.")) value = `'${value}'`;
      return `{renderFormat(${key},${value})}`;
      //return `{renderFormat(${params.replace(" as ", ",'")}')}`

    }
/*
    const algo = directive();
    const mas = /{([^}]+)}/.exec(algo);
    if (!mas) return args;
    const [key, value] = mas;
    if (value.includes(" in ")) return algo.replace(key, setin(value))
    if (value.includes(" of ")) return algo.replace(key, setof(value))
    if (value.includes(" as ")) return algo.replace(key, setas(value))

    return algo;*/

    return args;

  }

  return new Proxy(document.createElement(tagName), {

    get(target, prop, receiver) {

      if (prop == "for") { return (args) => { target.setAttribute("for", argsFormat(args || "")); return receiver; } }
      if (prop.startsWith("data")) { return (args) => { target.setAttribute(prop.replace("data", "data-"), argsFormat(args || "")); return receiver; } }
      if (prop == "getHTML" && target.tagName == "TEMPLATE") return target.content.cloneNode(true);
      if (prop == "getHTML") return target.cloneNode(true);
      if (prop == "html") return (args) => {
        if (args instanceof HTMLElement && target.tagName == "TEMPLATE") { target.content.appendChild(args.getHTML); return receiver; }
        if (args instanceof HTMLElement) { target.appendChild(args.getHTML); return receiver; }
        if (typeof (args) == "string" && args.startsWith("<svg")) { target.insertAdjacentHTML("beforeend", args); return receiver; }
        if (typeof (args) == "string") { target.append(argsFormat(args || "")); return receiver; }
        if (args instanceof Array) args.forEach(arg => receiver.html(arg));
        return receiver;
      };

      if (prop in target) {

        return (args) => {
          if (prop.startsWith("class")) { target.className = argsFormat(args || ""); return receiver; }
          if (prop.startsWith("on")) target.dataset.on = ""
          target.setAttribute(prop, argsFormat(args || ""));
          return receiver;
        }
      }

      if (!(prop in target)) { return (args) => { target.setAttribute(`data-${prop}`, argsFormat(args || "")); return receiver; } }

      return target[prop];
    },

  });

}

export function html(tagName) { return element(tagName); }
export function template() { return element("template"); }
export function div() { return element("div"); }
export function header() { return element("header"); }
export function section() { return element("section"); }
export function footer() { return element("footer"); }
export function img() { return element("img"); }
export function nav() { return element("nav"); }
export function aside() { return element("aside"); }
export function main() { return element("main"); }
export function article() { return element("article"); }
export function form() { return element("form"); }
export function dialog() { return element("dialog"); }
export function input() { return element("input"); }
export function button() { return element("button"); }
export function label() { return element("label"); }
export function progress() { return element("progress"); }
export function select() { return element("select"); }
export function option() { return element("option"); }
export function optgroup() { return element("optgroup"); }
export function ol() { return element("ol"); }
export function ul() { return element("ul"); }
export function li() { return element("li"); }
export function a() { return element("a"); }
export function p() { return element("p"); }
export function i() { return element("i"); }
export function h1() { return element("h1"); }
export function h2() { return element("h2"); }
export function h3() { return element("h3"); }
export function h4() { return element("h4"); }
export function h5() { return element("h5"); }
export function h6() { return element("h6"); }
export function span() { return element("span"); }
export function table() { return element("table"); }
export function thead() { return element("thead"); }
export function tbody() { return element("tbody"); }
export function tfooter() { return element("tfooter"); }
export function caption() { return element("caption"); }
export function tr() { return element("tr"); }
export function td() { return element("td"); }
export function th() { return element("th"); }
export function iframe() { return element("iframe"); }
export function hr() { return element("hr"); }

