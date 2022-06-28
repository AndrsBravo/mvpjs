export default function (selector) {
    console.log("LLamando el utility");
    return new utility(selector);
}

class utility {

    #contexto = [];

    constructor(el) {       


        if (typeof (el) == "function") {
            window.addEventListener("load", el);
            return null;
        }

        if (typeof (el) == "undefined") {
            el = document;
            return null;
        }

        if (el instanceof HTMLElement) {
            this.#contexto.push(el);
            return this;
        }

        if (el instanceof NodeList) {
            for (var a = 0; a < el.length; a++) {
                this.#contexto.push(el[a]);
            }
            return this;
        }

        if (el instanceof HTMLCollection) {
            for (var a = 0; a < el.length; a++) {
                this.#contexto.push(el[a]);
            }
            return this;
        }

        if (typeof(el) == "string") {

           // console.log("LLamando el el", el);

            //Se entiende que es un String(id, class)
            el = document.querySelectorAll(el);

            if (el.length > 0) {

                for (var a = 0; a < el.length; a++) {
                    this.#contexto.push(el[a]);
                }
                return this;
            }

        }
      
       
    }

    select() {
        this.#contexto.forEach(element => element.classList.add("selected"));
        return this;
    }
    unselect() {
        this.#contexto.forEach(element => { element.classList.remove("selected"); console.log(element) });
        return this;
    }

}