import fs from 'node:fs'
import formatTemplate from "lib/mvp/view/render/formatTemplate.js"
import mvpSsr from "lib/mvp/ssr/ssRender.js"

export default async function (index, sender, views) {

    const html = getTemplate(index)
    const SECTIONS_REGEXP = /{{([\w]+)}}/g

    if (!html) return
    const sections = html.matchAll(SECTIONS_REGEXP)

    let obj = { sections: [], _data: {}, _content: html, data: setData, send: sendFunction, _sender: sender };
    for (const section of sections) {

        const [value, key] = section;
        obj.sections.push(value);
        obj = { [key]: await sectionFunction(key, value, views), ...obj };

    }

    return obj

}
async function sectionFunction(key, value, views) {

    return function (section) {
        // //console.log("colocar esta section en ", section, key, value);

        if (!views) { console.log("There are not templates registered"); return this }
        const view = views[section];
        if (!view) { console.log(section, "Is not valid template name"); return this }

        if (!fs.existsSync(view.path)) { console.log("Path does not exists:\n", view.path); return this }

        const content = getTemplate(view.path)
        this._content = this._content.replace(value, content)

        return this
    }
}
function setData(data) {
    this._data = data;
    return this
}
function sendFunction() {

    this._content = formatTemplate(this._content);
    let rendered = mvpSsr(this._data, this._content);

    for (const section of this.sections) {

        //console.log("Las Section", section);
        rendered = rendered.replace(section, '')
    }

    this._sender(rendered);

}
function getTemplate(file) {

    return fs.readFileSync(file, { encoding: 'utf-8' })

}