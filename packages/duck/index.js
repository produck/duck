'use strict';

const EventEmitter = require('events');
const debug = require('debug')('duck:factory');

const Normalizer = require('./src/Normalizer');
const Injection = require('./src/Injection');
const Validator = require('./src/Validator');
const normalize = require('./src/normalizeOptions');

const meta = require('./package.json');

Product.Normalizer = Normalizer;
Product.Injection = Injection;
Product.Validator = Validator;
module.exports = Product;

function Product(options, callback = () => {}) {
	const finalOptions = normalize(options);

	debug('Instant a product id=`%s`', finalOptions.id);

	const product = Object.defineProperties(new EventEmitter(), {
		meta: {
			get() {
				return {
					id: finalOptions.id,
					name: finalOptions.name,
					namespace: finalOptions.namespace,
					version: finalOptions.version,
					description: finalOptions.description
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
		product,
		Debug: debug
	}, finalOptions.injection));
	
	const components = {
		metas: {},
		installerList: [],
		createdList: []
	};

	finalOptions.components.forEach(component => {
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
	finalOptions.installed(injection);
	Object.freeze(injection);
	components.createdList.forEach(fn => fn(injection));

	/**
	 * Allow to access all injection for final assembling.
	 */
	callback(injection);

	return product;
}