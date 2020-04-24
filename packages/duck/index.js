'use strict';

const debug = require('debug')('duck');

const Normalizer = require('./src/Normalizer');
const Injection = require('./src/Injection');
const Validator = require('./src/Validator');
const normalize = require('./src/normalizeOptions');

const meta = require('./package.json');

ProductProvider.Normalizer = Normalizer;
ProductProvider.Injection = Injection;
ProductProvider.Validator = Validator;

module.exports = ProductProvider;

function ProductProvider(options, assembler = () => {}) {
	const finalOptions = normalize(options);

	/**
	 * Handle components
	 */
	const components = {
		metas: {},
		installerList: [],
		createdList: []
	};

	finalOptions.components.forEach(component => {
		const { id, name, version, description, install, created } = component;

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

	const product = Object.freeze({
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
	});

	function InstalledInjection() {
		debug('Creating a duck id=`%s`', finalOptions.id);

		const baseInjection = Injection('Duck.Base');

		/**
		 * Generate product context
		 */
		baseInjection.product = product;

		debug('Components options has been registered.');

		components.installerList.forEach(install => install(baseInjection));
		debug('`components.install()` has been called.');

		finalOptions.installed(baseInjection);
		debug('`options.installed()` has been called.');

		const installedInjection = baseInjection.$create('Duck.Installed');

		components.createdList.forEach(created => created(installedInjection));
		debug('`components.created` hooks of components has been called.');

		return installedInjection;
	}

	return function Product(options) {
		/**
		 * Allow to access all dependencies on `installed injection` in the final factory.
		 */
		return assembler(InstalledInjection(), options);
	};
}