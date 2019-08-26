'use strict';

const normalize = require('./OptionsNormalizer');

module.exports = function SessionPluginProvider(originalOptions) {
	const options = normalize(originalOptions);

	return function SessionPlugin(_injection, context) {
		context.Session = {
			install(app) {
				
			}
		};
	};
};