'use strict';

const Normalizer = require('./Normalizer');
const Validator = require('./Validator');
const schema = require('./OptionsSchema.json');

module.exports = Normalizer({
	handler(options) {
		const finalOptions = {
			name: 'Default Product Name',
			namespace: '',
			version: '0.0.0',
			description: 'No descrition',
			components: []
		};

		const {
			id: _id,
			name: _name = finalOptions.name,
			namespace: _namespace = finalOptions.namespace,
			version: _version = finalOptions.version,
			description: _description = finalOptions.description,
			components: _components = finalOptions.components
		} = options;

		finalOptions.id = _id;
		finalOptions.name = _name;
		finalOptions.namespace = _namespace;
		finalOptions.version = _version;
		finalOptions.description = _description;
		finalOptions.components = _components.map(options => {
			const finalOptions = {
				description: 'No description',
				created: () => {},
				getDetails: () => null
			};

			const {
				id: _id,
				name: _name,
				install: _install,
				created: _created = finalOptions.created,
				description: _description = finalOptions.description,
				getDetails: _getDetails = finalOptions.getDetails
			} = options;

			finalOptions.id = _id;
			finalOptions.name = _name;
			finalOptions.install = _install;
			finalOptions.description = _description;
			finalOptions.created = _created;
			finalOptions.getDetails = _getDetails;

			return finalOptions;
		});

		return finalOptions;
	},
	validate: Validator(schema)
});