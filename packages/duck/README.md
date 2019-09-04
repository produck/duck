Duck is an extensible, lightweight, flexible, progressive software development frameworks for building software product. It uses dependency injection and control inversion just a little like "Java Spring". It help developers to create, use, manage various runtime objects to inject to whereever required. Everyone can extend framework directly in low cost.

In the past, we often have to face to inflexible, confused project directory problems in development in Node.js. Everyone could disgust require modules from parent directory like ``require('../../')``. Because it represent some coupling out of control. Duck resolve the problems above and provide a programming models to help developer avoid incorrect design.

Duck does not impose any restrictions on your coding style. But it will still provide the necessary guidance to advance the right design. Be brave enough to use your imagination to solve your problems.

The DUCK knows first when the river becomes warm in SPRING. Duck is used to build product!

# Installation

```
npm install @or-change/duck
```

# Usage

To build a very simple product,

```js
const Duck = require('@or-change/duck');
const meta = require('./package.json');

// To create the product factory named Simple.
function Simple() {
  const simple = {};

  Duck({
    id: 'com.orchange.duck.demo',
    name: 'Simple Product',
    version: meta.version
  }, ({ product }) => {
    // There will be 2 methods on a Simple product instance.
    
    simple.getMeta = function getMeta() {
      return product.meta;
    };

    simple.getComponents = function getComponents() {
      return product.components;
    }
  });

  return simple;
}

// To create a Simple product instance then use it.
const simple = Simple();

console.log(simple.getMeta());
// => {name: "Simple Product", namespace: "", version: "0.0.0", description: "Default product descrition"}

console.log(simple.getComponents());
// => []
// Because there is no component in the product.
```
# API Reference

- [Duck](#duck)
  * [Duck(options[, callback])](#duck-factory)
    * [options](#duck-factory-options)
    * [callback](#duck-factory-callback)
  * [Lifecycle](#duck-lifecycle)
- [Components](#duck-component)
  * [Instance](#duck-component-instance)
  * [Native Components](#duck-component-native)
- [Injection](#duck-injection)
  * [preset dependencies](#duck-injection-preset)

<a id="duck"></a>
## Duck

A duck instance is just an ``EventEmitter`` instance without any preset event. Everyone can emit necessary event by ``injection.product``.

[RECOMMANDED] Avoid using classes or constructors if there are no special requirements. For a framework for assembly resources like duck, ``class`` & ``constructor`` cause too much programming burden and are not flexible enough. There is almost no such need for ``inctanceof``. "Duck typing" always be useful.

<a id="duck-factory"></a>
### Duck(options[, callback])

``options`` is an object. ``callback`` is a function. Return a product instance. The product instance is extended from ``EventEmitter``. 

<a id="duck-factory-options"></a>
### Options

| **Property** | **Type**  | **Default value**       | **Description**              |
| ------------ | --------- | ----------------------- | ---------------------------- |
| id           | String    |                         | Product id                   |
| name         | String    | 'Default Product Name'  | Product name                 |
| namespace    | String    | ''                      | Namespace component may use  |
| version      | String    | '0.0.0'                 | Current version              |
| description  | String    | 'No descrition'         | What am I?                   |
| installed    | Object    | () => {}                | Invoking after components    |
| injection    | Object    | {}                      | Initial dependences          |
| components   | Array     | []                      | Product components list      |

[RECOMMANDED] Some dependencies just for current product can be injected into by ``options.injection`` to avoid defining components [(see components)](#duck-component). Because dependencies from components is universal and reusable across products.

[RECOMMANDED] In hook ``options.installed``, some direct dependencies using component dependencies could be created and injected into injection. In other words, injection could still be changed here and then to be non-extensible.

<a id="duck-factory-callback"></a>
### Callback

Only one formal parameter could be accessed is ``injection``. [RECOMMANDED] Using object destructuring assignment syntax to access dependencies of injection can make the code more clear. There is no meaningful context here (``this === null``). Arrow function is also accepted here if you like.

Injection is very IMPORTANT to be careful for using. Avoid to change injection outside of the Duck instance lifecycle. Because incorrect state may cause fatal runtime errors. This will not  help reduce R&D costs.

[RECOMMANDED] Accessing injection & dependencies in callback and providing external accessing by indirect way.

Best practice example,

```js
const Duck = require('@or-change/duck');
const http = require('http');

function MyProduct() {
  const product = {};

  Duck({
    id: 'com.xxx.yyy.zzz',
    component: [
      Duck.Web()
    ]
  }, function callback({ Web }) {
    // Access all dependences safely here.
    // Be careful and responsible for providing external indirect access to injected dependencies.
    product.start = function startServer() {
      return http.createServer(Web.Application.Default()).listen(8080);
    };
  });

  return product;
}

// External access.
const myProduct = MyProduct();

myProduct.start(); // Use injected dependence 'Web' indirectly.

// Use arrow callback function
function MyProductB() {
  Duck({
    id: 'com.xxx.yyy.zzz',
    component: [
      Duck.Web()
    ]
  }, ({ Web }) => {
    // There is no meaningful context here. (this === null)
    // Arrow function is also accepted here if you like will make the code more clear.

    console.log(Web);
  });
}
```

<a id="duck-lifecycle"></a>
### Lifecycle

1. Initialization
  * Normalizing options
  * Preparing product instance
  * Creating injection instance with ``options.injection``

> Mixin ``options.injection``

2. Installing components
  * Collecting all component configuration items
  * **Invoking all installers** of components
  * Setting dependencies or accessing dependencies unsafely

3. Preset product dependence
  * Setting product instance into injection as a dependence
  * Then freezing injection

> Invoking ``options.installed(injection)``

4. Components created
  * **Invoking all created hooks** of components
  * Accessing dependencies safely but can NOT changing injection any more

<!-- 
5. Freezing injection
  * Making injection non-extensible -->

> Invoking ``callback(injection)``

<a id="duck-product-dependence"></a>
### Product dependence

A ``product`` dependence will be injected into injection after components have been installed. The ``project`` provides ``meta``, ``components`` and ``duck`` getters to reflect the final abstract of the duck instance.

Use project dependence,

```js
const Duck = require('../');

Duck({
  id: 'com.xxx.yy.zz',
}, ({ project }) => {
  console.log(project.meta);
  console.log(project.components);
  console.log(project.duck);
});
```

``project.meta`` returns a new plain object every time. Pproperties,

| **Property** | **Type**  | **Example Value**       | **Description**              |
| ------------ | --------- | ----------------------- | ---------------------------- |
| id           | String    | 'com.xx.yy.zz'          | options.id                   |
| name         | String    | 'Default Product Name'  | options.name                 |
| namespace    | String    | ''                      | options.namespace            |
| version      | String    | '0.0.0'                 | options.version              |
| description  | String    | 'No descrition'         | options.description          |

``project.components`` returns a new array about used components. Each element properties,

| **Property** | **Type**  | **Example Value**       | **Description**              |
| ------------ | --------- | ----------------------- | ---------------------------- |
| id           | String    | 'com.xx.yy.zz'          | ``component.id``             |
| name         | String    | 'Component Name'        | ``component.name``           |
| description  | String    | 'No descrition'         | ``component.description``    |
| details      | any       | null                    | ``component.getDetails()``   |

``project.duck`` returns a new plain object about duck. Properties,

| **Property**     | **Type**  | **Example Value**       | **Description**              |
| ---------------- | --------- | ----------------------- | ---------------------------- |
| version          | String    | '0.0.0'                 | duck version                 |
| peerDependencies | object    | {}                      | duck peerDependencies        |

<a id="duck-component"></a>
## Component

``Component`` is use to append some runtime dependencies into injection. Each component instance MUST include 3 items to describe the features & meta of itself. They are ``id``, ``name``, ``install``. 

In addition, ``component.description`` is a string for describing what the component is. ``component.created`` a hook function will be called after the duck has been created.

[RECOMMENDED] Appending dependence only in ``component.install``. Accessing dependence only after duck instance created, like in ``component.created`` and Duck(options[, ``callback``]).

[NOTICE] Defining a component means that there are some widespread jobs need to be decoupled. Just use ``options.injection`` if there is no special need for flexibility.

Althought accessing when ``component.install`` is ok, it means "Component_A depends Component_B" that cause coulping between components. Developers can still handle these problems with care and "Put Component_A before Component_B" to ensure Component_B can use Component_A in install.

<a id="duck-component-instance"></a>
### Instance

Properties Table

| **Property** | **Type**  | **Default value** | **Description**              |
| ------------ | --------- | ----------------- | ---------------------------- |
| id           | String    |                   | Unique component id          |
| name         | String    |                   | Component name for display   |
| install      | Function  |                   | Installer                    |
| description  | String    | 'No description'  | Description                  |
| created      | Function  | () => {}          | Calling after duck created   |
| getDetails   | Function  | () => null        | Custom Details Snapshot      |

Create a component directly,

```js
const Duck = require('@or-change/duck');

Duck({
  id: 'com.orchange.duck.demo',
  components: [
    {
      id: 'com.example.duck.literal',
      name: 'DirectSample',
      install(injection) {
        // Append a dependence named 'foo'
        injection.foo = function () {
          return 'bar';
        }
      },
    }
  ]
}, ({ foo }) => {
  console.log(foo());
  // => 'bar'
});
```

The example is just want to tell developers that create a component by literal is be allowed. There is NO magic about component. Everyone can do everything in this pattern. [RECOMMANDED] Defining a factory to build a component instance like a provider can make the code clear and maintainable. Many native components have been defined in ``@or-change/duck``. Enjoy them!

Simple web application example,

```js
const http = require('http');
const Duck = require('@or-change/duck');

Duck({
  id: 'com.orchange.duck.demo',
  components: [
    Duck.Web()
  ]
}, ({ Web }) => {
  // Access Web.Application.Default to get the default application factory.
  // Call the factory then return the request listener instance of application.
  // The "Default" Application is provided by Web Component default options.
  http.createServer(Web.Application.Default()).listen(8080);
});

// Now, open your browser and navigate to http://localhost:8080
/**
{
  "meta": {
    "name": "Default Product Name",
    "namespace": "",
    "version": "0.0.0",
    "description": "No descrition"
  },
  "components": [
    {
      "id": "com.oc.duck.web",
      "name": "WebApplication",
      "description": "Used to guide developer to create a web application.",
      "details": null
    }
  ]
}
*/
```

<a id="duck-component-native"></a>
### Native Components

* [Web](/src/components/Web/README.md) - How to build a web application product?
* [Webpack](/src/components/Webpack/README.md) - Manage webpack configs.
* [Datahub](/src/components/Datahub) - Use data middle layer & define models.
* [Electron6](/src/components/Electron6/README.md) - How to build a integrated Electron application?
* Log //TODO - Build & manage log channel.
* HttpMitm //TODO Manage a mitm server instance.
* Sequenlize //TODO Provide sequenlize instance to everywhere.

<a id="duck-injection"></a>
## Injection

Injection is the core function to manage dependencies regularly. Dependencies could be in any form. After ``product dependence`` injection will be freezed [(see lifecycle)](#duck-lifecycle). Setting new dependence will become invalid.

<a id="duck-injection-instance"></a>
### Instance

An injection is use to set, get, transmit and manage dependencies to everywhere in a product. Each duck instance will create only one injection for itself. 

About injection, some facts MUST be known,

* Cannot get a dependence NOT existed.
* Cannot set a new dependence override a existed.
* The injection of a duck will be freezen after duck created.
* Inline Dependences - There are 2 dependencies on injection when created.
  * ``injection.injection`` reference itself for convenience.
  * ``injection.Injection`` used for components created an isolateing injection to manage local dependencies.

<a id="duck-injection-preset"></a>
### Preset dependencies


# License

[MIT](https://github.com/or-change/production/blob/master/LICENSE)