'use strict';

const abstract = {};

function ProductComponentWebpack(options) {
	const merge = require('webpack-merge');
	const store = {};

	return {
		id: 'com.oc.duck.webpack',
		name: 'WebpackConfigBuilder',
		description: 'Used to guide developer to create a web application.',
		install(injection) {
			function Webpack() {

			}

			function WebpackDev() {

			}

			Webpack.Dev = WebpackDev;
			injection.Webpack = {
				merge
			};
		},
		created(injection) {
			
		}
	};
}