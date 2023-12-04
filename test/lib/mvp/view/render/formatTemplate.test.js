import formatTemplate from "@/mvp/view/render/formatTemplate";
import { describe, expect, test } from "vitest";

describe("", () => {

    test('Template formatted ', () => {

        const tag = "<template> <header> {@@header_title in @@algo} </header>\n     <main>{@ nombre} chic@</main>\n    <footer>\n    </footer>  <div>{@nombre as  nombreFormato} </div>     </template> ";

        expect(formatTemplate).not.toBeNull()
        expect(typeof (tag)).toBe("string")
        expect(formatTemplate(tag)).toBe("<template><header> ${renderObject(meta.header_title,meta.algo)} </header><main>${data.nombre} chic@</main><footer></footer><div>${renderFormat(data.nombre,'nombreFormato')} </div></template>");

    })
    

})