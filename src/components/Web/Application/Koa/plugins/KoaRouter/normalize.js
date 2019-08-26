'use strict';

const Ajv = require('ajv');
const AjvKeywords = require('ajv-keywords');
const schema = require('./OptionsSchema.json');

const ajv = new Ajv({
	allErrors: true,
	verbose: true,
});

AjvKeywords(ajv, ['instanceof']);

const validate = ajv.compile(schema);

module.exports = function normalize(options) {
	validate(options);

	return (function normalizeOptionsNode(optionsNode) {
		const finalOptionsNode = {
			prefix: null,
			mount: null,
			use: []
		};

		const {
			prefix: _prefix = finalOptionsNode.prefix,
			mount: _mount = finalOptionsNode.mount,
			use: _use = finalOptionsNode.use,
			Router: _Router
		} = optionsNode;

		finalOptionsNode.prefix = _prefix;
		finalOptionsNode.mount = _mount;
		finalOptionsNode.Router = _Router;
		finalOptionsNode.use = _use.map(optionsNode => {
			return normalizeOptionsNode(optionsNode);
		});

		return finalOptionsNode;
	}(options));
};