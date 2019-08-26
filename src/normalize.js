'use strict';

function NOOP() {}

function validate() {
	return true;
}

module.exports = function normalizeProductOptions(options = {}) {
	validate(options);

	const finalOptions = {
		name: 'Default Product Name',
		namespace: '',
		version: '0.0.0',
		description: 'Default product descrition',
		beforeCreate: NOOP,
		created: NOOP,
		components: []
	};

	const {
		name: _name = finalOptions.name,
		namespace: _namespace = finalOptions.namespace,
		version: _version = finalOptions.version,
		description: _description = finalOptions.description,
		beforeCreate: _beforeCreate = finalOptions.beforeCreate,
		created: _created = finalOptions.created,
		components: _components = finalOptions.components
	} = options;

	finalOptions.name = _name;
	finalOptions.namespace = _namespace;
	finalOptions.version = _version;
	finalOptions.description = _description;
	finalOptions.beforeCreate = _beforeCreate;
	finalOptions.created = _created;
	finalOptions.components = _components.map(options => {
		const finalOptions = {
			description: 'No description',
			created: NOOP,
			getDetails() {
				return null;
			}
		};

		const {
			id: _id,
			name: _name,
			version: _version,
			install: _install,
			created: _created = finalOptions.created,
			description: _description = finalOptions.description,
			getDetails: _getDetails = finalOptions.getDetails
		} = options;

		finalOptions.id = _id;
		finalOptions.name = _name;
		finalOptions.version = _version;
		finalOptions.install = _install;
		finalOptions.description = _description;
		finalOptions.created = _created;
		finalOptions.getDetails = _getDetails;

		return finalOptions;
	});

	return finalOptions;
};