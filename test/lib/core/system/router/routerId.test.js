'use strict'
import routeId from "mvp/core/system/router/routeId.js";
import { describe, test } from "node:test"
import assert from "node:assert"

describe("Test Of Test", () => {

    test('routeId Should not be null', () => {
        assert.notEqual(routeId, null);
    })

    test("Test '/' route", async () => {

        const url = new URL("http://localhost:5173");

        const config = {};

        const result = await routeId(url, config);

        assert.strictEqual(result.pageRoute, "/")
        assert.strictEqual(result.id, "/_1c")
        assert.strictEqual(result.pageMethod, 'start')
        assert.strictEqual(result.pathname, '/')
        assert.strictEqual(result.search, '')
        assert.strictEqual(result.href, "http://localhost:5173/")
        assert.deepEqual(result.params, {})
        assert.deepEqual(result.values, [])

    })

    test("Test Route without base Path '/pacientes' route", async () => {

        const url = new URL("http://localhost:5173/pacientes");

        const config = {};

        const result = await routeId(url, config);

        assert.strictEqual(result.pageRoute, "pacientes")
        assert.strictEqual(result.id, "pacientes_7qn")
        assert.strictEqual(result.pageMethod, 'start')
        assert.strictEqual(result.pathname, '/pacientes')
        assert.strictEqual(result.search, '')
        assert.strictEqual(result.href, "http://localhost:5173/pacientes")
        assert.deepEqual(result.params, {})
        assert.deepEqual(result.values, [])

    })

    test("Test 'app/' route", async () => {

        const url = new URL("http://localhost:5173/app");

        const config = { base: "/app" };

        const result = await routeId(url, config);

        assert.strictEqual(result.pageRoute, "/")
        assert.strictEqual(result.id, "/_14x")
        assert.strictEqual(result.pageMethod, 'start')
        assert.strictEqual(result.pathname, '/app')
        assert.strictEqual(result.search, '')
        assert.strictEqual(result.href, "http://localhost:5173/app")
        assert.deepEqual(result.params, {})
        assert.deepEqual(result.values, [])

    })

    test("Test 'app/pacientes' route", async () => {

        const url = new URL("http://localhost:5173/app/pacientes");

        const config = { base: "/app" };

        const result = await routeId(url, config);

        assert.strictEqual(result.pageRoute, "pacientes")
        assert.strictEqual(result.id, "pacientes_et7")
        assert.strictEqual(result.pageMethod, 'start')
        assert.strictEqual(result.pathname, '/app/pacientes')
        assert.strictEqual(result.search, '')
        assert.deepEqual(result.params, {})
        assert.deepEqual(result.values, [])
        assert.strictEqual(result.href, "http://localhost:5173/app/pacientes")

    })

    test("Test 'app/pacientes/addNewPaciente' route", async () => {

        const url = new URL("http://localhost:5173/app/pacientes/addNewPaciente");

        const config = { base: "/app" };

        const result = await routeId(url, config);

        assert.strictEqual(result.pageRoute, "pacientes")
        assert.strictEqual(result.id, "pacientes_1r5b")
        assert.strictEqual(result.pageMethod, 'start')
        assert.strictEqual(result.pathname, '/app/pacientes/addNewPaciente')
        assert.strictEqual(result.search, '')
        assert.deepEqual(result.params, {})
        assert.deepEqual(result.values, ['addNewPaciente'])
        assert.strictEqual(result.href, "http://localhost:5173/app/pacientes/addNewPaciente")

    })

    test("Test 'app/pacientes/addNewPaciente?id=1&codigo=500' route", async () => {

        const url = new URL("http://localhost:5173/app/pacientes/addNewPaciente?id=1&codigo=500");

        const config = { base: "/app" };

        const result = await routeId(url, config);

        assert.strictEqual(result.pageRoute, "pacientes")
        assert.strictEqual(result.id, "pacientes_3xka")
        assert.strictEqual(result.pageMethod, 'start')
        assert.strictEqual(result.pathname, '/app/pacientes/addNewPaciente')
        assert.strictEqual(result.search, '?id=1&codigo=500')
        assert.deepEqual(result.params, { id: '1', codigo: '500' })
        assert.deepEqual(result.values, ['addNewPaciente'])
        assert.strictEqual(result.href, "http://localhost:5173/app/pacientes/addNewPaciente?id=1&codigo=500")

    })

});