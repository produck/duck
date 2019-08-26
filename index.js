'use strict';

const EventEmitter = require('events');
const normalize = require('./src/normalize');
const meta = require('./package.json');

function Product(options) {
	options = normalize(options);

	const product = new EventEmitter();
	const injection = { product };

	injection.injection = injection;

	Object.defineProperty(product, 'meta', {
		get() {
			return {
				name: options.name,
				namespace: options.namespace,
				version: options.version,
				description: options.description
			};
		}
	});

	/**
	 * Use to mixin other customized injection object.
	 */
	options.beforeCreate(injection);

	const components = {
		metas: {},
		installerList: [],
		createdList: []
	};

	options.components.forEach(component => {
		const { 
			id,
			name,
			version,
			description,
			install,
			created,
		} = component;

		if (components.metas[id]) {
			throw new Error(`Dumplicated product component '${id}' defined.`);
		}

		components.metas[id] = {
			id, name, version, description,
			getDetails() {
				return component.getDetails();
			}
		};
		components.installerList.push(install);
		components.createdList.push(created);
	});

	components.installerList.forEach(install => install(injection));
	Object.freeze(injection);
	Object.defineProperty(product, 'components', {
		get() {
			return {
				duck: {
					version: meta.version,
					peerDependencies: meta.peerDependencies
				},
				components: Object.keys(components.metas).map(id => {
					const meta = components.metas[id];

					return {
						id: meta.id,
						name: meta.name,
						description: meta.description,
						details: meta.getDetails()
					};
				})
			};
		}
	});
	components.createdList.forEach(fn => fn(injection));

	/**
	 * Allow to access all injection for final assembling.
	 */
	options.created(injection);

	return product;
}

Product.Web = require('./src/components/Web');
Product.Webpack = require('./src/components/webpack');
Product.Datahub = require('./src/components/datahub');

module.exports = Product;