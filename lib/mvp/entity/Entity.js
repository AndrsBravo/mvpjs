export default class {
  #name;
  #entity;
  #config;
  #level = 0;
  #data = [];
  #eps = {};

  constructor(name, entity, config) {
    this.#name = name;
    this.#entity = entity;
    this.#config = config;
    this.#setConfig(config);
  }

  #setConfig(config) {
    if (config.eps) {
      this.#eps = config.eps;
      for (const endpoint in config.eps) {
        this.#eps[endpoint] = new EndPoint(config.eps[endpoint]);

        this[endpoint] = async (data) => {
          console.log("Se intenta llamar esto desde " + endpoint);
          return await this.#eps[endpoint].fetch(data);
        };
      }
    }
  }

  getName() {
    return this.#name;
  }
  getEntity() {
    return this.#entity;
  }
  getLevel() {
    return this.#level;
  }
  getData() {
    return this.#data;
  }
  setData(data) {
    this.#data = data;
  }

  addData(data) {
    if (data instanceof Array) {
      data.forEach((dato) => this.#data.push(dato));
      return;
    }

    this.#data.push(data);
  }
  /** @returns RequestInit  */
  get requestInit() { return new RequestInit(); }
}

class EndPoint {
  #endpoint;
  #currentEndPoint;
  constructor(data) {
    this.#endpoint = data;
    this.#currentEndPoint = data;
  }

  async fetch(params) {

    if (params) {

      this.#algo(params);
    }

    const res = await fetch(this.#currentEndPoint);
    return await res.json();
  }

  #algo(params) {

    if (this.#endpoint.indexOf("{") == -1 || this.#endpoint.indexOf("}") == -1) return;

    this.#currentEndPoint = this.#endpoint;

    while (this.#currentEndPoint.indexOf("{") > -1 && this.#currentEndPoint.indexOf("}") > -1) {
      var property = /{([^}]+)}/.exec(this.#currentEndPoint);

      this.#currentEndPoint = this.#currentEndPoint.replaceAll(property[0], params[property[1]]);
    }
  }
}

class RequestInit {
/** @type Object */
  #requestInit = {};
  /** @type RequestCache */
  #requestCache;
  /**@type RequestCredentials */
  #requestCredentials;
  /** @type BooleanOption */
  #keepalive;
  /** @type RequestMode */
  #mode;
  /** @type RequestRedirect */
  #redirect;
  /** @type ReferrerPolicy */
  #referrerPolicy;
  /** @type Method */
  #method;
  /** @type HeadersInit */
  #headersInit;
  constructor() { }

  /** @returns Object */
  get build() { return this.#requestInit; }

  /**@returns RequestCache */
  get cache() { if (!this.#requestCache) { this.#requestCache = new RequestCache(this, this.#requestInit); } return this.#requestCache }

  get credentials() { if (this.#requestCredentials) { this.#requestCredentials = new RequestCredentials(this, this.#requestInit); } return this.#requestCredentials; }

  /**@returns HeadersInit */
  get headers() { if (!this.#headersInit) { this.#headersInit = new HeadersInit(this, this.#requestInit); } return this.#headersInit; }

  integrity(key) { this.#requestInit["integrity"] = key; return this; }

  get keepalive() { if (!this.#keepalive) { this.#keepalive = new BooleanOption(this, this.#requestInit, "keepalive"); } return this.#keepalive; }
  get method() { if (!this.#method) this.#method = new Method(this, this.#requestInit); return this.#method; }

  /** @returns RequestMode */
  get mode() { if (!this.#mode) { this.#mode = new RequestMode(this, this.#requestInit) } return this.#mode; }
  get redirect() { if (!this.#redirect) { this.#redirect = new RequestRedirect(this, this.#requestInit) } return this.#redirect; }
  referrer(referrer) { this.#requestInit["referrer"] = referrer; return this; }
  get referrerPolicy() { if (!this.#referrerPolicy) this.#referrerPolicy = new ReferrerPolicy(this, this.#requestInit); return this.#referrerPolicy; }
  get signal() { AbortSignal | null; }

  get window() { null; }

}

class RequestInitBase {

  #requestData;
  #requestInit;
  #property;
  /**
   * 
   * @param {RequestInit} requestInit 
   * @param {Object} requestData 
   * @param {String} property 
   */
  constructor(requestInit, requestData, property) { this.#requestInit = requestInit; this.#requestData = requestData; this.#property = property; }
  update(value) { this.#requestData[this.#property] = value; return this.#requestInit; }
  
}

class RequestCache extends RequestInitBase {

  constructor(requestInit, requestData) {
    super(requestInit, requestData, "cache")
  }

  get force_cache() { return this.update("force-cache"); }
  get no_cache() { return this.update("no-cache"); }
  get no_store() { return this.update("no-store"); }
  get only_if_cached() { return this.update("only-if-cached"); }
  get reload() { return this.update("reload"); }

}

class RequestCredentials extends RequestInitBase {

  constructor(requestInit, requestData) { super(requestInit, requestData, "credentials") }

  get include() { return this.update("include"); }
  get omit() { return this.update("omit"); }
  get same_origin() { return this.update("same-origin"); }

}

class BooleanOption extends RequestInitBase {
  constructor(requestInit, requestData, property) { super(requestInit, requestData, property) }
  get true() { return this.update(true); }
  get false() { return this.update(false); } 
}

class RequestMode extends RequestInitBase {

  constructor(requestInit, requestData) {
    super(requestInit, requestData, "mode");
  }

  get navigate() { return this.update("navigate"); }
  get cors() { return this.update("cors"); }
  get no_cors() { return this.update("no-cors"); }
  get same_origin() { return this.update("same-origin"); }

}

class RequestRedirect extends RequestInitBase {

  constructor(requestInit, requestData) {
    super(requestInit, requestData, "redirect");
  }

  get error() { return this.update("error") }
  get manual() { return this.update("manual") }

}

class ReferrerPolicy extends RequestInitBase {

  constructor(requestInit, requestData) {
    super(requestInit, requestData, "referrerPolicy");
  }


  get no_referrer_when_downgrade() { return this.update("no-referrer-when-downgrade") }
  get origin() { return this.update("origin") }
  get origin_when_cross_origin() { return this.update("origin-when-cross-origin") }
  get same_origin() { return this.update("same-origin") }
  get strict_origin() { return this.update("strict-origin") }
  get strict_origin_when_cross_origin() { return this.update("strict-origin-when-cross-origin") }
  get unsafe_url() { return this.update("unsafe-url") }


}

class Method extends RequestInitBase {

  constructor(requestInit, requestData) {
    super(requestInit, requestData, "method");
  }

  get GET() { return this.update("GET") }
  get POST() { return this.update("POST") }
  get PUT() { return this.update("PUT") }
  get DELETE() { return this.update("DELETE") }
  get HEAD() { return this.update("HEAD") }
  get CONNECT() { return this.update("CONNECT") }
  get OPTIONS() { return this.update("OPTIONS") }
  get TRACE() { return this.update("TRACE") }
  get PATCH() { return this.update("PATCH") }

}

//MIMEtype

class HeadersInit extends RequestInitBase {

  #content_type;
  #requestInit; #requestData;
  constructor(requestInit, requestData) {
    super(requestInit, requestData, "headers");
    this.#requestData = requestData;
    this.#requestInit = requestInit;
    this.update({});
  }

  get Content_Type() {
    if (!this.#content_type) { this.#content_type = new ContentType(this.#requestInit, this.#requestData.headers) }
    return this.#content_type;
  }


}

class ContentType extends RequestInitBase {

  #charset = "chartset=utf-8";
  #mime_type = "text/plain";

  /**
   * 
   * @param {RequestInit} requestInit 
   * @param {HeadersInit} requestData 
   */
  constructor(requestInit, requestData) {
    super(requestInit, requestData, "'Content-Type'");
  }

  /**
   * @description Set a Content-Type with MIME-Type 'text/plain' and charset='utf-8'
   */
  get default() { return this.#commonMimeTypeAction(); }
  get text_html() { this.#mime_type = "text/html"; return this.#commonMimeTypeAction(); }
  get multipart_form_data() { return this.update("multipart/form-data;") }
  get application_json() { this.#mime_type = "application/json"; return this.#commonMimeTypeAction() }
  /**
   * 
   * @param {String} mime_type 
   * @description Set the MIME-Type  
   */
  MIMEtype(mime_type) { return this.update(`${mime_type};`) }
  charset(charset) { this.#charset = `charset=${charset}`; return this.#commonMimeTypeAction(); }

  #commonMimeTypeAction() {
    return this.update(`${this.#mime_type}; ${this.#charset}`)
  }
}

