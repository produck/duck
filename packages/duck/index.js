'use strict';

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

function Duck(options, Instance = () => {}) {
	const finalOptions = normalize(options);

	debug('Creating a duck id=`%s`', finalOptions.id);

	const product = {
		get meta() {
			return {
				id: finalOptions.id,
				name: finalOptions.name,
				namespace: finalOptions.namespace,
				version: finalOptions.version,
				description: finalOptions.description
			};
		},
		get components() {
			return Object.keys(components.metas).map(id => {
				const meta = components.metas[id];

				return {
					id: meta.id,
					name: meta.name,
					description: meta.description,
					details: meta.getDetails()
				};
			});
		},
		get duck() {
			return {
				version: meta.version,
				peerDependencies: meta.peerDependencies
			};
		}
	};

	const initObject = Object.assign({ product }, finalOptions.injection);
	const baseInjection = Injection('Duck.Base', initObject);

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
	components.installerList.forEach(install => install(baseInjection));
	debug('`components.install()` has been called.');
	finalOptions.installed(baseInjection);
	debug('`options.installed()` has been called.');

	const installedInjection = baseInjection.$create('Duck.Installed');

	debug('The injection of duck has been freezen.');
	components.createdList.forEach(created => created(installedInjection));
	debug('`components.created` hooks of components has been called.');

	/**
	 * Allow to access all dependencies on `installed injection` in final factory.
	 */
	const instance = Instance(installedInjection);

	debug('The final `Instance()` factory has been called.');

	return instance;
}