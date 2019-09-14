'use strict';

const EventEmitter = require('events');
const debug = require('debug')('duck');

const Normalizer = require('./src/Normalizer');
const Injection = require('./src/Injection');
const Validator = require('./src/Validator');
const normalize = require('./src/normalizeOptions');

const meta = require('./package.json');

Duck.Normalizer = Normalizer;
Duck.Injection = Injection;
Duck.Validator = Validator;
module.exports = Duck;

function Duck(options, callback = () => {}) {
	const finalOptions = normalize(options);

	debug('Creating a duck id=`%s`', finalOptions.id);

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

	const initObject = Object.assign({ product }, finalOptions.injection);
	const injection = Injection(initObject, 'duck');

	debug('The injection of duck has been created.');
	
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
	debug('Components options has been registered.');

	components.installerList.forEach(install => install(injection));
	debug('`components.install()` has been called.');
	finalOptions.installed(injection);
	debug('`options.installed()` has been called.');
	Object.freeze(injection);
	debug('The injection of duck has been freezen.');
	components.createdList.forEach(created => created(injection));
	debug('`components.created` hooks of components has been called.');

	/**
	 * Allow to access all injection for final assembling.
	 */
	callback(injection);
	debug('The final `callback()` has been called.');

	return product;
}