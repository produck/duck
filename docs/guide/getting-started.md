# Getting started


## Installation
1. As usual，
```bash
npm init
```
2. Install `@produck/duck` as dependence，
```bash
npm install @produck/duck
```
## Creating a simple product

```js
// index.js

const Duck = require('@produck/duck');
const meta = require('./package.json');

const ExampleFactory = Duck({
	id: 'any.yourgroup.example.other', // To give a id.
	name: meta.name, // A readable name
	version: meta.version // Setting the semver. (May be not from package.json)
}, function Example({ product, injection }, options) {
	// Injection & modules assemble here.

	// Do something about options
	const timeout = options.timeout;

	// Using injection
	injection.foo = 'bar';
	//...

	// Exporting a product instance.
	return {
		showMeta() {
			// Print the meta data of this product after `options.timeout` as time.
			setTimeout(() => console.log(product.meta), timeout);
		}
	};
});

// Now, creating a `Example` instance.
const example = ExampleFactory({
	timeout: 50
});

// Then, using the example.
example.showMeta();

// Or, exporting `ExampleFactory` as a module.
module.exports = ExampleFactory;
```

Ah, a new product, a good name! What else can be added next?🤔