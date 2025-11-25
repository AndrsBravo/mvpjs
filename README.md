# MVPJS

The Vanilla JavaScript Framework

```bash
npm install mvpjs
```

## Getting started

Init an `npm project` as usually `npm init -y` an then

```bash
mvpjs init
```

Claro. A continuación te proporciono una **documentación paso a paso** para explicar el funcionamiento del endpoint definido en el framework **MVP.js**, utilizando el código que compartiste:

---

## 📘 Documentación del Endpoint `/search` en MVP.js

### Descripción general

Este ejemplo muestra cómo definir un endpoint GET en el framework **MVP.js**, utilizando su sistema de enrutamiento decorado y su integración con el módulo de SEO (`@mvpjs/seo`). Este endpoint está diseñado para renderizar una página de búsqueda con metaetiquetas optimizadas para motores de búsqueda.

---

### Código completo

```js
import { Seo } from "@mvpjs/seo";

/** @route(/search) */
export function get(req, res) {
  const seo = Seo.Title("Application - Search")
    .Description("This is application descripción")
    .KeyWords("Search,")
    .build();

  res.index.Seo(seo).page("layout").content("search").send();
}
```

---

### Explicación paso a paso

#### 1. `import {Seo} from "@mvpjs/seo"`

Se importa el módulo de SEO proporcionado por MVP.js. Este módulo permite construir objetos con información relevante para SEO, como el título, la descripción y las palabras clave.

---

#### 2. `/** @route(/search) */`

Este comentario especial (decorador de ruta) indica que la función siguiente maneja solicitudes HTTP `GET` al path `/search`. MVP.js usa estos comentarios para mapear rutas automáticamente sin necesidad de declarar rutas explícitamente.

---

#### 3. `export function get(req, res) { ... }`

Define el controlador para la ruta `/search` con el método `GET`. Los parámetros `req` y `res` representan el objeto de solicitud y respuesta, respectivamente.

---

#### 4. Construcción del objeto SEO

```js
const seo = Seo.Title("Application - Search")
  .Description("This is application descripción")
  .KeyWords("Search,")
  .build();
```

Aquí se construye un objeto `seo` con:

- **Título**: "Application - Search"
- **Descripción**: "This is application descripción"
- **Palabras clave**: "Search"

Se utiliza una API encadenada (`fluent interface`) que termina con `.build()` para generar el objeto final que será inyectado en la página HTML como metaetiquetas.

---

#### 5. Renderización de la respuesta

```js
res.index.Seo(seo).page("layout").content("search").send();
```

Este bloque representa el flujo de renderizado de la página usando la respuesta `res` personalizada de MVP.js:

- `.Seo(seo)`: Inyecta los metadatos SEO en la respuesta.
- `.page("layout")`: Indica que se usará la plantilla de layout llamada `"layout"` como base.
- `.content("search")`: Especifica que el contenido central de la página proviene de una vista llamada `"search"`.
- `.send()`: Finaliza la construcción de la respuesta y la envía al cliente.

---

### Resultado

El navegador del cliente recibirá una página HTML que:

- Tiene una estructura definida por la plantilla `"layout"`.
- Incluye un bloque de contenido `"search"`.
- Contiene etiquetas SEO configuradas con título, descripción y palabras clave.

---

### ✅ Recomendaciones

- Asegúrate de que las plantillas `"layout"` y `"search"` existan en tu sistema de vistas.
- Personaliza las etiquetas SEO con contenido relevante para mejorar el posicionamiento.
- Este patrón es ideal para mantener el código limpio y desacoplado, al separar el contenido, la plantilla y el SEO.

---

¿Te gustaría que también escriba este ejemplo en forma de plantilla para tu documentación oficial o sitio web?
