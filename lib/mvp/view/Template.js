export class Template {

    #name;
    #html;

    /**
     * @param {string} name 
     * @param {HtmlTemplateBuilder} htmlTemplate 
     */
    constructor(name, htmlTemplate) {
        this.#name = name;
        this.#html = htmlTemplate;
    }

    getHTML() {

      
       /* if (this.#html instanceof HTMLElement) {
            console.log("Es un html element");
            return this.#html;
        }*/

      
        return this.#html.getHTML;
    }

    getName() { return this.#name; }

}