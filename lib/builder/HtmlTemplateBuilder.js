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
export default function (tagName) {
  return new HtmlElement(tagName);
}

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
   * @param {String} clases
   * @returns HtmlElement
   */
  setClass(clases) {
    this.elem.className = clases;

    return this;
  }
  setAction(action) {
    this.elem.action = action;

    return this;
  }

  setId(id) {
    this.elem.id = id;

    return this;
  }
  /**
   *
   * @param {String} href
   * @returns HtmlElement
   */
  setHref(href) {
    this.elem.href = href;

    return this;
  }

  setDataAddClass(clases) {
    this.elem.setAttribute("data-addclass", clases);

    return this;
  }

  setSection(section) {
    this.elem.setAttribute("data-section", section);

    return this;
  }

  setDataValue(value) {
    this.elem.setAttribute("data-data-value", value);

    return this;
  }

  setValue(value) {
    this.elem.setAttribute("value", value);

    return this;
  }
/**
 * 
 * @param {String} value 
 * @returns HtmlElement
 * @description Allow collumn (:)  separate pair, eventName (click,mouseup,mousedown,etc) with the correspond eventListener (callbackFN). To add multiple event, separate pairs with semicollumn (;) 
 */
  setSysEvent(value) {
    this.elem.setAttribute("data-sys-event", value);

    return this;
  }
  setOn(event, value) {
    this.elem.setAttribute(`on${event.toLowerCase()}`, value);

    return this;
  }

  setController(value) {
    this.elem.setAttribute("data-controller", JSON.stringify(value));

    return this;
  }

  setBinding(value) {
    this.elem.setAttribute("data-binding", JSON.stringify(value));

    return this;
  }

  setBind(value) {
    this.elem.setAttribute("data-bind", value);

    return this;
  }

  setDataText(value) {
    this.elem.setAttribute("data-data-text", value);

    return this;
  }

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

  setDataFormat(value) {
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
  setDataModelo(value) {
    this.elem.setAttribute("data-modelo", value);

    return this;
  }
  setDataTemplate(value) {
    this.elem.setAttribute("data-template", value);

    return this;
  }

  setDataView(value) {
    this.elem.setAttribute("data-view", value);

    return this;
  }
  setAttr(attr, value) {
    this.elem.setAttribute(attr, value);

    return this;
  }

  setText(text) {
    this.elem.innerTEXT = text;

    return this;
  }
  /**
   *
   * @param {String} title
   * @returns HtmlElement
   */
  setTitle(title) {
    this.elem.title = title;
    return this;
  }

  setType(type) {
    this.elem.type = type;

    return this;
  }

  setName(name) {
    this.elem.name = name;

    return this;
  }

  setHTML(html) {
    if (html instanceof Array) {
      html.forEach((el) => {
        this.setHTML(el);
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

  getHTML() {
    return this.elem.cloneNode(true);
  }
}
