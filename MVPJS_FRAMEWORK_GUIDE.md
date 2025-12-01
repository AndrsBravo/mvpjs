# mvpjs Framework Guide - Complete Reference

Complete reference for mvpjs framework concepts and patterns.

## Table of Contents

1. [Framework Overview](#framework-overview)
2. [Core Concepts](#core-concepts)
3. [Pages](#pages)
4. [Views](#views)
5. [HTML Templates](#html-templates)
6. [IDs Collection](#ids-collection)
7. [Sections Collection](#sections-collection)
8. [Lifecycle](#lifecycle)
9. [Data Binding](#data-binding)
10. [Decorators](#decorators)
11. [HTTP Petitions (EndPointCollection)](#http-petitions-endpointcollection)
12. [Client Router System](#client-router-system)
13. [Best Practices](#best-practices)
14. [Summary Table](#summary-table)

---

## Framework Overview

mvpjs is a lightweight MVC/MVP framework for building interactive web applications with server-side rendering (SSR) support. It provides tools for managing UI components, page lifecycle, and data flow.

**Core Philosophy:**
- Separation of concerns (Pages, Views, Templates)
- Declarative routing with decorators
- Reactive data binding
- SSR-first development

---

## Core Concepts

### Pages
- **Purpose**: Controllers that manage page lifecycle and sections
- **Location**: `frontend/client/[module]/pages/` or root pages
- **Decorator**: `@page(route)`
- **Inherits from**: `Page` class
- **Lifecycle**: `constructor()` → `start()` → `render()`

### Views
- **Purpose**: UI components that render HTML and manage interactions
- **Location**: `frontend/client/[module]/` (any subdirectory)
- **Inherits from**: `View` class
- **Responsibilities**: Template rendering, event handling, model binding

### HTML Templates
- **Purpose**: Declarative HTML markup separated from View classes
- **Format**: Plain HTML or template literals
- **Placement**: Same directory as View, separate `.html` file
- **Integration**: Imported and passed to View
- **Vite Resolution**: Automatic `.html` import at dev/build time

---

## Pages

### What is a Page?

A Page is the top-level controller for a route. It:
- Manages the entire page lifecycle
- Contains multiple sections
- Handles navigation state
- Initializes data fetching

### Page Structure

```javascript
import { Page } from "mvpjs/page";

/** @page(/route-path) */
export default class MyPage extends Page {
    
    constructor() {
        super({
            name: "MyPage",
            sections: { 
                sectionName: new MyView()
            }
        })
    }

    async start() {
        // Page lifecycle starts here
        // Initialize data, set up views, etc.
    }

}
```

### Page Decorator: `@page`

**Syntax**: `@page(path, options)`

- `path` (required): Route path (e.g., `/settings`, `/products/:id`)
- `options` (optional): Configuration object

**Example**:
```javascript
/** @page(/servicecategories) */
export default class ServiceCategoriesPage extends Page { }
```

---

## Views

### What is a View?

A View is a UI component that:
- Renders HTML templates
- Manages user interactions
- Binds data to the template
- Can contain sub-views

### View Structure

```javascript
import { View } from "mvpjs/view";
import myTemplate from "./myTemplate.html";

export default class MyView extends View {
    
    constructor() {
        super({
            name: "MyView",
            template: myTemplate
        })
    }

    async render() {
        // Render the template
    }

}
```

### Setting the Model

A View can receive data through a model:

```javascript
const view = new MyView();
const data = { /* some data */ };
view.setModel(data);
```

The model becomes available for binding in the template.

---

## HTML Templates

### Template Format

Templates are plain HTML files with special attributes for binding and sections:

```html
<div class="container">
    <h1 data-bind="title"></h1>
    <div data-section="list"></div>
</div>
```

### Template Attributes

#### `data-bind`
- **Purpose**: Bind model properties to HTML text content
- **Syntax**: `data-bind="propertyName"`
- **Example**: `<span data-bind="username"></span>`
- **Updates**: When model changes, text updates automatically

#### `data-section`
- **Purpose**: Define placeholder for sub-views
- **Syntax**: `data-section="sectionName"`
- **Example**: `<div data-section="list"></div>`
- **How it works**: Page injects Views into these sections

#### `data-repeat`
- **Purpose**: Repeat element for each item in array
- **Syntax**: `data-repeat="arrayProperty"`
- **Example**: `<div data-repeat="items">...</div>`
- **Context**: Inside the repeated element, use `data-bind` for item properties

### Template Naming Conventions

**Pattern**: `[componentName][Suffix].html`

| Suffix | Usage | Example |
|--------|-------|---------|
| `Content` | Page content container | `serviceCategoriesContent.html` |
| `_list` | List component | `service_category_list.html` |
| `_option` | Option/select item | `category_option.html` |
| (none) | General view | `menuTemplate.html` |

### Vite Integration

mvpjs uses Vite's module resolution to handle `.html` imports:

```javascript
import template from "./template.html";

const view = new View({
    template: template // String of HTML content
});
```

**How it works:**
1. Vite sees the `.html` import
2. Loads the file as a string
3. Passes the string to the View
4. View renders it to the DOM

**Note**: This works in development and production (Vite handles both).

---

## IDs Collection

### What is `this.ids`?

`this.ids` is a collection that provides access to HTML elements by their `id` attribute. Available in Pages and Views.

### Syntax

```javascript
this.ids.elementId.method()
```

### Methods

#### `.select()`
Adds the `selected` class to the element.

```javascript
this.ids.servicecategories.select()
```

**HTML Effect**:
```html
<div id="servicecategories" class="selected"></div>
```

#### `.unselect()`
Removes the `selected` class.

```javascript
this.ids.servicecategories.unselect()
```

#### `.toggle()`
Toggles the `selected` class.

```javascript
this.ids.servicecategories.toggle()
```

#### `.html()`
Returns the actual DOM element.

```javascript
const element = this.ids.servicecategories.html()
element.addEventListener('click', handler)
```

### Use Cases

1. **Menu item highlighting**: Select active menu item
2. **Tab switching**: Toggle between tabs
3. **Toggle visibility**: Add/remove `selected` class for show/hide
4. **DOM manipulation**: Access element for custom interactions

### Requirements

The element must have an `id` attribute:

```html
<li id="servicecategories">Categories</li>
```

---

## Sections Collection

### What is `this.sections`?

`this.sections` is a collection that manages where Views are rendered in the page. Views are injected into sections marked with `data-section`.

### How it Works

**Step 1: Define section in template**
```html
<div data-section="list"></div>
```

**Step 2: Inject View in Page**
```javascript
async start() {
    const listView = new ListView();
    this.sections.add({ list: listView })
}
```

**Step 3: Result**
- The ListView renders its template inside the `<div data-section="list">`
- mvpjs automatically adds `id="list"` to that div
- The View becomes accessible and updatable

### Methods

#### `.add(sectionsObject)`
Inject one or more Views into sections.

```javascript
this.sections.add({ 
    content: new ContentView(),
    sidebar: new SidebarView()
})
```

### Dynamic Sections

Sections can be added at any time:

```javascript
async start() {
    // Add initial sections
    this.sections.add({ content: new HomeView() })
    
    // Later, add more
    const data = await fetchData()
    this.sections.add({ details: new DetailView() })
}
```

### Section vs ID

| Concept | Purpose | Usage |
|---------|---------|-------|
| **Section** (`data-section`) | Render Views (components) | `this.sections.add({name: view})` |
| **ID** (`id`) | Access individual elements | `this.ids.name.select()` |

Both can coexist in a template.

---

## Lifecycle

### Page Lifecycle

```
1. Constructor
   ├─ Called when Page class is instantiated
   └─ Initialize sections with initial Views
   
2. Start
   ├─ Called when page route is activated
   ├─ Initialize data fetching
   ├─ Set up event listeners
   └─ Add dynamic sections
   
3. Render
   ├─ Called automatically after start()
   ├─ Views render their templates
   └─ Page is displayed to user
```

### View Lifecycle

```
1. Constructor
   ├─ Initialize view with name and template
   └─ Set default configuration
   
2. setModel(data)
   ├─ Receive data from Page
   └─ Store for binding
   
3. render()
   ├─ Parse template
   ├─ Bind data to template
   └─ Insert into DOM
   
4. Event Handling
   ├─ User interactions trigger handlers
   └─ Can update model and re-render
```

---

## Data Binding

### One-Way Binding: `data-bind`

Automatically updates HTML when model changes.

**Template**:
```html
<h1 data-bind="title"></h1>
```

**Code**:
```javascript
view.setModel({ title: "My Title" })
```

**Result**:
```html
<h1>My Title</h1>
```

### List Binding: `data-repeat`

Repeats element for each array item.

**Template**:
```html
<div data-repeat="items">
    <p data-bind="name"></p>
</div>
```

**Code**:
```javascript
view.setModel({ 
    items: [
        { name: "Item 1" },
        { name: "Item 2" }
    ]
})
```

**Result**:
```html
<div>
    <p>Item 1</p>
    <p>Item 2</p>
</div>
```

---

## Decorators

### `@page`

Marks a class as a Page and defines its route.

```javascript
/** @page(/route) */
export default class MyPage extends Page { }
```

### `@route`

Marks a function as an API route handler (backend). The HTTP method is determined by the function name.

**Syntax**: `@route(path)`

- `path` (required): Route path (e.g., `/api/users`, `/api/clients/:id`)
- HTTP method is determined by function name: `get`, `post`, `put`, `delete`, `patch`, `head`, `options`
- `export default` = GET request
- `export const get` = GET request
- `export const post` = POST request

**Examples**:
```javascript
// GET request
/** @route(/api/users) */
export const get = async (req, res) => {
  // GET /api/users
}

// POST request
/** @route(/api/users) */
export const post = async (req, res) => {
  // POST /api/users
}

// PUT request
/** @route(/api/users/:id) */
export const put = async (req, res) => {
  // PUT /api/users/:id
}

// DELETE request
/** @route(/api/users/:id) */
export const delete = async (req, res) => {
  // DELETE /api/users/:id
}

// GET by default
/** @route(/api/users) */
export default async function(req, res) {
  // GET /api/users
}
```

### `@middleware`

Applies middleware to a route. Middleware is placed in an array before the handler function.

```javascript
// Single middleware
/** @route(/api/users) */
export const post = [
  validateAuthMiddleware,
  async (req, res) => {
    // Handler with middleware
  }
]

// Multiple middleware
/** @route(/api/users) */
export const post = [
  validateAuthMiddleware,
  validateDataMiddleware,
  checkPermissionsMiddleware,
  async (req, res) => {
    // Handler with multiple middleware
  }
]
```

---

## HTTP Petitions (EndPointCollection)

### What is EndPointCollection?

`EndPointCollection` is a class that manages all HTTP endpoints for your application. It provides:
- Centralized API endpoint management
- Built-in request configuration with `requestInitBuilder()`
- Automatic caching and storage strategies
- Type-safe endpoint definitions

### EndPointCollection Structure

```javascript
import { EndPointCollection, requestInitBuilder } from "mvpjs/end-point-data-source";

export default class MyEndPoints extends EndPointCollection {
  constructor() {
    super({
      name: "MyEndPoints",
      baseURL: "/v1/api",
      endPoints: {
        // Define your endpoints here
        getUsers: {
          url: "/users",
          requestInit: requestInitBuilder()
            .method.GET
            .headers.ContentType.application_json
            .build,
          cache: {
            enabled: true,
            type: "localStorage",
            ttl: 3600000
          }
        }
      }
    });
  }
}
```

### RequestInitBuilder - Building HTTP Requests

`requestInitBuilder()` is a fluent interface for constructing HTTP requests safely and intuitively.

#### HTTP Methods

```javascript
requestInitBuilder().method.GET.build
requestInitBuilder().method.POST.build
requestInitBuilder().method.PUT.build
requestInitBuilder().method.DELETE.build
requestInitBuilder().method.PATCH.build
requestInitBuilder().method.HEAD.build
```

#### Content-Type Headers

```javascript
requestInitBuilder()
  .headers.ContentType.application_json
  .build

requestInitBuilder()
  .headers.ContentType.text_html
  .build

requestInitBuilder()
  .headers.ContentType.multipart_form_data
  .build
```

#### Cache Control

```javascript
requestInitBuilder()
  .cache.no_store          // Don't cache
  .build

requestInitBuilder()
  .cache.force_cache       // Always use cache
  .build

requestInitBuilder()
  .cache.no_cache          // Validate before using cache
  .build
```

#### Credentials & Security

```javascript
requestInitBuilder()
  .credentials.include     // Include cookies/auth
  .build

requestInitBuilder()
  .credentials.same_origin // Same-origin only
  .build
```

#### Other Options

```javascript
requestInitBuilder()
  .mode.cors               // CORS mode
  .keepalive.true          // Keep connection alive
  .redirect.manual         // Manual redirect handling
  .build
```

### Storage/Caching Strategy

Each endpoint can define where to store retrieved data:

**Storage Types:**
- **memory** - RAM (cleared on page refresh)
- **sessionStorage** - Available during active session
- **localStorage** - Persistent across sessions
- **indexedDB** - Complex browser database

**Configuration:**

```javascript
cache: {
  enabled: true,          // Enable caching
  type: "localStorage",   // Storage type
  ttl: 3600000            // Time to live (1 hour)
}
```

### Complete Example - ClientsEndPoints

```javascript
import { EndPointCollection, requestInitBuilder } from "mvpjs/end-point-data-source";

export default class ClientsEndPoints extends EndPointCollection {
  constructor() {
    super({
      name: "ClientsEndPoints",
      baseURL: "/v1/clients",
      endPoints: {
        // Read - cached in localStorage
        ListClients: {
          url: "/",
          requestInit: requestInitBuilder()
            .method.GET
            .headers.ContentType.application_json
            .cache.force_cache
            .build,
          cache: {
            enabled: true,
            type: "localStorage",
            ttl: 1800000  // 30 minutes
          }
        },
        
        // Create - no cache
        CreateClient: {
          url: "/",
          requestInit: requestInitBuilder()
            .method.POST
            .headers.ContentType.application_json
            .cache.no_store
            .credentials.include
            .build,
          cache: { enabled: false }
        },
        
        // Update - no cache
        UpdateClient: {
          url: "/{@client_id}",
          requestInit: requestInitBuilder()
            .method.PUT
            .headers.ContentType.application_json
            .cache.no_store
            .build,
          cache: { enabled: false }
        },
        
        // Filter - sessionStorage
        FilterClients: {
          url: "/filter",
          requestInit: requestInitBuilder()
            .method.POST
            .headers.ContentType.application_json
            .keepalive.true
            .build,
          cache: {
            enabled: true,
            type: "sessionStorage"
          }
        }
      }
    });
  }
}
```

### RequestInitBuilder - Future Enhancements

Features planned for upcoming versions:
- ✅ Advanced authorization headers (Bearer, Basic Auth, API Keys)
- ✅ Custom headers
- ✅ Body builders (JSON, FormData, XML)
- ✅ Timeout configuration
- ✅ Automatic retry logic
- ✅ Request/Response interceptors
- ✅ Request validation
- ✅ Advanced error handling
- ✅ Rate limiting

---

## Client Router System

### Overview

MVPJS features an **automatic client-side router** that detects and loads routes based on `@page` decorators in Page classes. A custom Vite plugin manages this process, creating a hierarchical routes structure.

### How It Works

#### 1. Plugin Detection (vite-template.js)

The custom Vite plugin:
- Scans all Page files with `@page` decorators
- Detects `.html` template imports
- Creates automatic route hierarchy
- Transforms templates for optimal rendering

#### 2. Auto-Generated Routes Structure

Routes are stored in a JavaScript object (generated automatically):

```javascript
// Location: client/_modules/routes.js (auto-generated)

{
  "/users": {
    "page": () => import('...UsersPage'),
    "layout": () => import('...UsersLayout'),
    ":id": {
      "page": () => import('...UserDetailPage'),
      "layout": () => import('...UserDetailLayout')
    }
  },
  "/settings": {
    "page": () => import('...SettingsPage'),
    "layout": () => import('...SettingsLayout')
  }
}
```

### Navigation Flow - From Click to DOM

```
1. USER CLICKS LINK
   ↓
2. RouteService.callCreateRoute(location)
   ↓
3. Get route path from location
   ↓
4. CHECK IF LAYOUT CACHED
   ├─ If not cached:
   │  ├─ Load Layout from routes object
   │  ├─ Import and instantiate Layout
   │  ├─ Render Layout
   │  └─ Call Layout.start()
   └─ If cached: Use cached instance
   ↓
5. CREATE ROUTE INSTANCE
   ├─ new Route(location, routeObj)
   ↓
6. RENDER PAGE
   ├─ Import Page class
   ├─ Instantiate Page
   ├─ Set Page metadata (params, query, etc.)
   ├─ Set Layout for Page
   ├─ Call Page[method]() if exists
   └─ Call Page.start()
   ↓
7. REGISTER ROUTE
   ├─ Store in #routesMap
   ├─ Add to route history
   └─ Set as current route
   ↓
8. SHOW PAGE
   ├─ Close previous route (if exists)
   ├─ Call Page.show()
   ├─ Render Page sections in DOM
   └─ Update browser history
   ↓
9. RESULT: PAGE VISIBLE IN DOM
```

### Key Classes

- **RouteService**: Manages all client routes
- **Route**: Represents a single route
- **Layout**: Page structure/container
- **Page**: Page controller

### Features

✅ **Automatic Route Detection**
✅ **Hierarchical Routes**
✅ **Layout Caching**
✅ **Lazy Loading**
✅ **Browser History**
✅ **Route Metadata**
✅ **Cascading Render**

---

## Best Practices

### Pages

✅ **Do:**
- Keep Pages lean (delegation to Views/Services)
- Initialize all sections in constructor or start()
- Use async/await for data fetching
- Call `this.ids.*.select()` to highlight active navigation

❌ **Don't:**
- Render HTML directly in Pages
- Keep references to Views unless needed later
- Manipulate DOM directly (use Views instead)

### Views

✅ **Do:**
- Keep Views focused on UI
- Use separate HTML template files
- Implement setModel() to receive data
- Handle user events in the View

❌ **Don't:**
- Make API calls (use EndPoints instead)
- Access other Views directly
- Render multiple unrelated components in one View

### Templates

✅ **Do:**
- Use `data-bind` for text content
- Use `data-section` for sub-views
- Use `data-repeat` for lists
- Keep templates simple and readable

❌ **Don't:**
- Put business logic in templates
- Mix styling and markup excessively
- Create deeply nested data-repeat structures

### HTTP Endpoints

✅ **Do:**
- Define all endpoints in a dedicated EndPointCollection class
- Use appropriate storage types (no cache for mutations)
- Centralize API configuration
- Use consistent naming for endpoints
- Leverage caching for read operations

❌ **Don't:**
- Mix endpoint definitions across multiple files
- Cache POST/PUT/DELETE operations unnecessarily
- Store sensitive data in localStorage
- Define endpoints inline in Pages/Views

### Server Routes

✅ **Do:**
- Use only the route path in `@route()` decorator
- Determine HTTP method by function name
- Place middleware in array before handler
- Use consistent naming: `get`, `post`, `put`, `delete`, `patch`
- Delegate business logic to services

❌ **Don't:**
- Include HTTP method in `@route()` decorator
- Mix middleware and handler logic
- Create overly complex route handlers
- Ignore input validation

---

## Summary Table

| Concept | Purpose | Location | Decorator |
|---------|---------|----------|-----------|
| **Page** | Controller for route | `pages/` | `@page()` |
| **View** | UI component | `views/` | None |
| **Template** | HTML markup | `.html` file | None |
| **IDs** | Access elements | In template `id=""` | Via `this.ids` |
| **Sections** | Render Views | In template `data-section=""` | Via `this.sections` |
| **EndPointCollection** | HTTP management | `endpoints/` | None |
| **Route** | API handler | `routes/` | `@route()` |
| **Middleware** | Request processing | `routes/` | `@middleware()` |

---

**Last Updated**: November 25, 2025
