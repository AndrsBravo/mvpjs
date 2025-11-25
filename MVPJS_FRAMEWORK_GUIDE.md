# mvpjs Framework Guide

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

Marks a method as an API route handler (backend).

```javascript
/** @route(POST, /api/endpoint) */
async handleCreate(req, res) { }
```

### `@middleware`

Applies middleware to a route.

```javascript
/** @route(POST, /api/endpoint) */
/** @middleware(validateAuth) */
async handleCreate(req, res) { }
```

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

---

## Summary Table

| Concept | Purpose | Location | Decorator |
|---------|---------|----------|-----------|
| **Page** | Controller for route | `pages/` | `@page()` |
| **View** | UI component | `views/` | None |
| **Template** | HTML markup | `.html` file | None |
| **IDs** | Access elements | In template `id=""` | Via `this.ids` |
| **Sections** | Render Views | In template `data-section=""` | Via `this.sections` |

