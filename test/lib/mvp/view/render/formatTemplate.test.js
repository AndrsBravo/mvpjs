"use strict"
import formatTemplate from "mvp/mvp/view/render/formatTemplate.js";
import { describe, test } from "node:test";
import assert from "node:assert";

describe("", () => {

    test('Template formatted ', () => {

        const tag = "<template> <header> {@@header_title in @@algo} </header>\n     <main>{@ nombre} chic@</main>\n    <footer>\n    </footer>  <div>{@nombre as  nombreFormato} </div>     </template> ";

        assert.notEqual(formatTemplate, null)
        assert.equal(typeof (tag), "string")
        assert.strictEqual(formatTemplate(tag), "<template><header> ${renderObject(meta.header_title,meta.algo)} </header><main>${data.nombre} chic@</main><footer></footer><div>${renderFormat(data.nombre,'nombreFormato')} </div></template>");

    })


})