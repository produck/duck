'use strict';

const merge = require('webpack-merge');
const normalize = require('./src/normalizeOptions');

module.exports = function DuckWebpack(Templates) {
	const TemplateStore = {};

	for (const name in Templates) {
		TemplateStore[name] = Templates[name];
	}

	return {
		id: 'com.oc.duck.webpack',
		name: 'WebpackConfigBuilder',
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
		}
	};
};