/*
    This BuilderClass has a static method 'create' to create a HTMLTemplate
    In order to get the HTML to insert in the DOM, call getHTML() function at the end of
    the building proces 
*/
/**
 *
 * @param {string} tagName
 * @returns HtmlElement
 */
export default function (tagName) { return new HtmlElement(tagName); }

export function div() { return new HtmlElement("div"); }
export function header() { return new HtmlElement("header"); }
export function section() { return new HtmlElement("section"); }
export function footer() { return new HtmlElement("footer"); }
export function img() { return new HtmlElement("img"); }
export function nav() { return new HtmlElement("nav"); }
export function aside() { return new HtmlElement("aside"); }
export function main() { return new HtmlElement("main"); }
export function article() { return new HtmlElement("article"); }
export function form() { return new HtmlElement("form"); }
export function input() { return new HtmlElement("input"); }
export function button() { return new HtmlElement("button"); }
export function label() { return new HtmlElement("label"); }
export function progress() { return new HtmlElement("progress"); }
export function ol() { return new HtmlElement("ol"); }
export function ul() { return new HtmlElement("ul"); }
export function li() { return new HtmlElement("li"); }
export function a() { return new HtmlElement("a"); }
export function p() { return new HtmlElement("p"); }
export function i() { return new HtmlElement("i"); }
export function h1() { return new HtmlElement("h1"); }
export function h2() { return new HtmlElement("h2"); }
export function h3() { return new HtmlElement("h3"); }
export function h4() { return new HtmlElement("h4"); }
export function h5() { return new HtmlElement("h5"); }
export function h6() { return new HtmlElement("h6"); }
export function span() { return new HtmlElement("span"); }
export function table() { return new HtmlElement("table"); }
export function thead() { return new HtmlElement("thead"); }
export function tbody() { return new HtmlElement("tbody"); }
export function tfooter() { return new HtmlElement("tfooter"); }
export function caption() { return new HtmlElement("caption"); }
export function tr() { return new HtmlElement("tr"); }
export function td() { return new HtmlElement("td"); }
export function th() { return new HtmlElement("th"); }

class HtmlElement {
  elem;

  constructor(tagName) {
    if (tagName) {
      this.elem = document.createElement(tagName);
    } else {
      this.elem = document.createElement("div");
    }
  }
  /**
   *
   * @param {String} className
   * @returns HtmlElement
   */
  class(className) { this.elem.className = className; return this; }
  setAction(action) {
    this.elem.action = action;

    return this;
  }

  id(id) { this.elem.id = id; return this; }
  for(value) { this.elem.for = value; return this; }

  /**
   *
   * @param {String} href
   * @returns HtmlElement
   */
  href(href) { this.elem.href = href; return this; }

  setDataAddClass(clases) {
    this.elem.setAttribute("data-addclass", clases);

    return this;
  }

  section(section) { this.elem.setAttribute("data-section", section); return this; }

  setDataValue(value) {
    this.elem.setAttribute("data-data-value", value);

    return this;
  }

  value(value) { this.elem.value = value; return this; }
  max(value) { this.elem.max = value; return this; }
  /**
   *
   * @param {String} eventName
   * @param {String} value
   * @returns HtmlElement
   * @description Allow event  ,eventName as (click,mouseup,mousedown,etc), value as CallBack fn
   */
  on(eventName, value) {
    this.elem.setAttribute("data-on", "");
    this.elem.setAttribute(`data-on${eventName.toLowerCase()}`, value);
    return this;
  }

  setController(value) {
    this.elem.setAttribute("data-controller", JSON.stringify(value));

    return this;
  }

  bind(value) {
    this.elem.setAttribute("data-bind", value);

    return this;
  }

  field(value) {
    this.elem.setAttribute("data-field", value);

    return this;
  }

  setBind(value) {
    this.elem.setAttribute("data-bind", value);

    return this;
  }

  text(value) { this.elem.setAttribute("data-text", value); return this; }

  setDataId(value) {
    this.elem.setAttribute("data-data-id", value);

    return this;
  }

  setDataTargetId(value) {
    this.elem.setAttribute("data-targetid", value);

    return this;
  }

  setDataTargetActionId(value) {
    this.elem.setAttribute("data-targetactionid", value);

    return this;
  }

  setDataFormatId(value) {
    this.elem.setAttribute("data-formatid", value);

    return this;
  }

  setDataTargetThisId(value) {
    this.elem.setAttribute("data-targetthisid", value);

    return this;
  }

  setDataTargetTab(value) {
    this.elem.setAttribute("data-targettab", value);

    return this;
  }

  setDataTabClose(value) {
    this.elem.setAttribute("data-tabclose", value);

    return this;
  }

  setDataIndex(value) {
    this.elem.setAttribute("data-index", value);

    return this;
  }
  setDataIndexParam(value) {
    this.elem.setAttribute("data-indexparam", value);

    return this;
  }
  setDataOrder(value) {
    this.elem.setAttribute("data-order", value);

    return this;
  }

  format(value) {
    this.elem.setAttribute("data-format", value);

    return this;
  }

  setDataEntidad(value) {
    this.elem.setAttribute("data-entidad", value);

    return this;
  }
  
  setDataTable(value) {
    this.elem.setAttribute("data-table", value);

    return this;
  }
  setDataTableHeaders(value) {
    this.elem.setAttribute("data-tableheaders", value);

    return this;
  }
  setDataTableContent(value) {
    this.elem.setAttribute("data-tablecontent", value);

    return this;
  }
  model(value) { this.elem.setAttribute("data-model", value); return this; }
  template(value) { this.elem.setAttribute("data-template", value); return this; }

  setDataView(value) {
    this.elem.setAttribute("data-view", value);

    return this;
  }
  attr(attr, value) { this.elem.setAttribute(attr, value); return this; }

  setText(text) {
    this.elem.innerTEXT = text;

    return this;
  }
  /**
   *
   * @param {String} title
   * @returns HtmlElement
   */
  title(title) { this.elem.title = title; return this; }
  type(type) { this.elem.type = type; return this; }
  name(name) { this.elem.name = name; return this; }
  accept(name) { this.elem.accept = name; return this; }
  multiple() { this.elem.multiple = "true"; return this; }
  html(html) {
    if (html instanceof Array) {
      html.forEach((el) => {
        this.html(el);
      });
      return this;
    }

    if (html instanceof HtmlElement) {
      this.elem.append(html.getHTML());
      return this;
    }
    if (html.startsWith("<svg")) {
      this.elem.insertAdjacentHTML("beforeend", html);
      return this;
    }

    this.elem.append(html);

    return this;
  }
  innerHTML(text){

    this.elem.innerHTML=text;

    return this;
  }

  getHTML() {
    return this.elem.cloneNode(true);
  }
}

function toCapitalizeCase(text) {
  return (
    text.trim().charAt(0).toUpperCase() + text.trim().substr(1).toLowerCase()
  );
}
