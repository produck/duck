'use strict';

const EventEmitter = require('events');
const debug = require('debug')('duck:factory');
const Normalizer = require('./src/Normalizer');
const normalize = require('./src/OptionsNormalizer');
const Injection = require('./src/Injection');
const meta = require('./package.json');

function Product(options, callback = () => {}) {
	options = normalize(options);

	debug('Instant a product id=`%s`', options.id);

	const product = Object.defineProperties(new EventEmitter(), {
		meta: {
			get() {
				return {
					id: options.id,
					name: options.name,
					namespace: options.namespace,
					version: options.version,
					description: options.description
				};
			}
		},
		components: {
			get() {
				return Object.keys(components.metas).map(id => {
					const meta = components.metas[id];

					return {
						id: meta.id,
						name: meta.name,
						description: meta.description,
						details: meta.getDetails()
					};
				});
			}
		},
		duck: {
			get() {
				return {
					version: meta.version,
					peerDependencies: meta.peerDependencies
				};
			}
		}
	});

	const injection = Injection(Object.assign({
		product, debug
	}, options.injection));
	
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
	options.installed(injection);
	Object.freeze(injection);
	components.createdList.forEach(fn => fn(injection));

	/**
	 * Allow to access all injection for final assembling.
	 */
	callback(injection);

	return product;
}

Product.Normalizer = Normalizer;
module.exports = Product;