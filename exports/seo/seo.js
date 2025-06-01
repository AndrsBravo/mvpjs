class SeoClass {
    constructor() {
        this.title = "";
        this.description = "";
        this.keywords = "";
    }

    setTitle(title) {
        this.title = title;
        return this;
    }

    setDescription(description) {
        this.description = description;
        return this;
    }

    setKeyWords(keywords) {

        if (keywords instanceof Array) {
            this.keywords = keywords.join(","); return this;
        }

        this.keywords = keywords;
        return this;
    }
}
class SeoBuilder {



    constructor() {
        this.seo = new SeoClass();
    }

    Title(title) {
        this.seo.setTitle(title);
        return this;
    }

    Description(description) {
        this.seo.setDescription(description);
        return this;
    }

    KeyWords(keywords) {
        this.seo.setKeyWords(keywords);
        return this;
    }

    build() {
        return this.seo;
    }
}
const Seo = new SeoBuilder();

export { Seo };
