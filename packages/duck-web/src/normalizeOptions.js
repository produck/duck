'use strict';

const { Normalizer, Validator } = require('@produck/duck');
const schema = require('./OptionsSchema.json');
const AjvKeywords = require('ajv-keywords');
const Application = require('./Application');

module.exports = Normalizer({
	defaults() {
		return [
			{
				id: 'Default',
				description: 'Default application example can view `meta`, `components`, `duck` of `product`.',
				Application: Application.Default
			}
		];
	},
	handler(applicationOptionsList) {
		return applicationOptionsList.map(options => {
			const finalOptions = {
				description: 'No description.'
			};

			const {
				id: _id,
				Application: _Application,
				description: _description = finalOptions.description
			} = options;

			finalOptions.id = _id;
			finalOptions.Application = _Application;
			finalOptions.description = _description;

			return finalOptions;
		});
	},
	validate: Validator(schema, ajv => {
		AjvKeywords(ajv, [
			'instanceof',
			'uniqueItemProperties'
		]);
	})
});