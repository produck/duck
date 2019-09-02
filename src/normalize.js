'use strict';

const Ajv = require('ajv');
const AjvKeywords = require('ajv-keywords');
const schema = require('./schema.json');

const ajv = new Ajv({
	allErrors: true,
	verbose: true,
});

AjvKeywords(ajv, ['instanceof']);

const validate = ajv.compile(schema);

module.exports = function normalizeProductOptions(options) {
	const valid = validate(options);

	if (!valid) {
		validate.errors.forEach(error => {
			console.error(error);
		});

		throw new Error(JSON.stringify(validate.errors, null, '  '));
	}

	const finalOptions = {
		name: 'Default Product Name',
		namespace: '',
		version: '0.0.0',
		description: 'No descrition',
		injection: {},
		components: []
	};

	const {
		id: _id,
		name: _name = finalOptions.name,
		namespace: _namespace = finalOptions.namespace,
		version: _version = finalOptions.version,
		description: _description = finalOptions.description,
		injection: _injection = finalOptions.injection,
		components: _components = finalOptions.components
	} = options;

	finalOptions.id = _id;
	finalOptions.name = _name;
	finalOptions.namespace = _namespace;
	finalOptions.version = _version;
	finalOptions.description = _description;
	finalOptions.injection = _injection;
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
};