'use strict';

const { Normalizer } = require('@or-change/duck');
const schema = require('./OptionsSchema.json');

module.exports = Normalizer(schema, options => {
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
});