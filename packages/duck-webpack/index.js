'use strict';

const merge = require('webpack-merge');
const normalize = require('./src/normalizeOptions');
const debug = require('debug')('duck:webpack');

module.exports = function DuckWebpack(TemplatesOptions) {
	const finalTemplatesOptions = normalize(TemplatesOptions);
	const TemplateStore = {};

	if (Object.keys(finalTemplatesOptions).length === 0) {
		debug('Warning: There is NOT any options of templates.');
	}

	for (const name in finalTemplatesOptions) {
		TemplateStore[name] = finalTemplatesOptions[name];
	}

	return {
		id: 'com.oc.duck.webpack',
		name: 'WebpackConfigTemplateManager',
		description: 'Used to guide developer to create a web application.',
		install(injection) {
			function Webpack(templateName, ...args) {
				const Template = TemplateStore[templateName];

				if (Template === undefined) {
					throw new Error(`The webpack template named '${templateName}' is NOT defined.`);
				}

				return Template(injection, ...args);
			}

			Webpack.merge = merge;
			injection.Webpack = Object.freeze(Webpack);
			Object.freeze(TemplatesOptions);
			debug('Webpack template manager ready.');
		}
	};
};