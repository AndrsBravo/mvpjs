import routeId from "@core/system/router/routeId";
import {describe,test,expect} from "vitest"

describe("Test Of Test", () => {

    test('routeId Should not be null', () => {
        expect(routeId).not.toBeNull();
    })

    test("Test '/' route", async () => {

        const url = new URL("http://localhost:5173");
        
        const config = {};

        const result = await routeId(url, config);

        expect(result.pageRoute).toBe("/")
        expect(result.id).toBe("/_1c")
        expect(result.pageMethod).toBe('start')
        expect(result.pathname).toBe('/')
        expect(result.search).toBe('')
        expect(result.href).toBe("http://localhost:5173/")
        expect(result.params).toStrictEqual({})
        expect(result.values).toStrictEqual([])

    })

    test("Test Route without base Path '/pacientes' route", async () => {

        const url = new URL("http://localhost:5173/pacientes");
        
        const config = {};

        const result = await routeId(url, config);

        expect(result.pageRoute).toBe("pacientes")
        expect(result.id).toBe("pacientes_7qn")
        expect(result.pageMethod).toBe('start')
        expect(result.pathname).toBe('/pacientes')
        expect(result.search).toBe('')
        expect(result.href).toBe("http://localhost:5173/pacientes")
        expect(result.params).toStrictEqual({})
        expect(result.values).toStrictEqual([])

    })

    test("Test 'app/' route", async () => {

        const url = new URL("http://localhost:5173/app");
        
        const config = { base: "/app" };

        const result = await routeId(url, config);

        expect(result.pageRoute).toBe("/")
        expect(result.id).toBe("/_14x")
        expect(result.pageMethod).toBe('start')
        expect(result.pathname).toBe('/app')
        expect(result.search).toBe('')
        expect(result.href).toBe("http://localhost:5173/app")
        expect(result.params).toStrictEqual({})
        expect(result.values).toStrictEqual([])

    })

    test("Test 'app/pacientes' route", async () => {

        const url = new URL("http://localhost:5173/app/pacientes");
        
        const config = { base: "/app" };

        const result = await routeId(url, config);

        expect(result.pageRoute).toBe("pacientes")
        expect(result.id).toBe("pacientes_et7")
        expect(result.pageMethod).toBe('start')
        expect(result.pathname).toBe('/app/pacientes')
        expect(result.search).toBe('')
        expect(result.params).toStrictEqual({})
        expect(result.values).toStrictEqual([])
        expect(result.href).toBe("http://localhost:5173/app/pacientes")

    })

    test("Test 'app/pacientes/addNewPaciente' route", async () => {

        const url = new URL("http://localhost:5173/app/pacientes/addNewPaciente");
        
        const config = { base: "/app" };

        const result = await routeId(url, config);

        expect(result.pageRoute).toBe("pacientes")
        expect(result.id).toBe("pacientes_1r5b")
        expect(result.pageMethod).toBe('start')
        expect(result.pathname).toBe('/app/pacientes/addNewPaciente')
        expect(result.search).toBe('')
        expect(result.params).toStrictEqual({})
        expect(result.values).toStrictEqual(['addNewPaciente'])
        expect(result.href).toBe("http://localhost:5173/app/pacientes/addNewPaciente")

    })

    test("Test 'app/pacientes/addNewPaciente?id=1&codigo=500' route", async () => {

        const url = new URL("http://localhost:5173/app/pacientes/addNewPaciente?id=1&codigo=500");
        
        const config = { base: "/app" };

        const result = await routeId(url, config);

        expect(result.pageRoute).toBe("pacientes")
        expect(result.id).toBe("pacientes_3xka")
        expect(result.pageMethod).toBe('start')
        expect(result.pathname).toBe('/app/pacientes/addNewPaciente')
        expect(result.search).toBe('?id=1&codigo=500')
        expect(result.params).toStrictEqual({ id: '1', codigo: '500' })
        expect(result.values).toStrictEqual(['addNewPaciente'])
        expect(result.href).toBe("http://localhost:5173/app/pacientes/addNewPaciente?id=1&codigo=500")

    })

});