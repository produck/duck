'use strict';

// function extend(extender, extensionOptions) {

// }
const debug = require('debug')('duck:extender');

module.exports = function DuckExtender(options, extensionsOptions) {
	const {
		Extension,
		IExtender,
		IRegistry,
		ExtenderContext,
		extend
	} = options;

	const extensions = {};

	function normalizeExtensionOptions(params) {

	}

	return {
		id: 'org.duck.extender',
		name: 'Extender',
		description: 'Help to construct plugins platform for product.',
		install(injection) {
			debug('Creating duck extender component.');

			const context = ExtenderContext(injection);

			injection.Extender = Object.freeze({
				compile(dependenceName) {
					extensionsOptions.forEach(function useExtension(extensionOptions) {
						const finalExtensionOptions = normalizeExtensionOptions(extensionOptions);
						const { id, Extension } = finalExtensionOptions;

						extensions[id] = finalExtensionOptions;

						const iExtender = IExtender(context);
						//TODO no repeat

						extend(context, iExtender, Extension);
					});

					Object.keys(extensionsOptions).reduce((installers, extensionOptions) => {
						return installers.concat(extensionOptions.installers);
					}, []).filter(installer => {
						const { target, version } = installer;

						//TODO exact query.
					}).forEach(installer => {
						const { target, install } = installer;
						const extension = extensions[target];


						if (extension) {
							install(extension.IInstallerExtender());
						}
					});

					injection[dependenceName] = IRegistry(context);
				}
			});
		},
		getDetails() {
			return Object.keys(extensions).map(extensionId => {
				const options = extensions[extensionId];

				return {
					id: extensionId,
					name: options.name,
					version: options.version,
					description: options.description
				};
			});
		}
	};
};