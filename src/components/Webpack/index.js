'use strict';

const mearge = require('webpack-merge');
const abstract = {};

function ProductComponentWebpack(options) {

	return {
		id: 'com.oc.duck.webpack',
		name: 'WebApplication',
		description: 'Used to guide developer to create a web application.',
		install(injection) {
			function Webpack() {

			}

			function WebpackDev() {

			}

			Webpack.Dev = WebpackDev;
			injection.Webpack = Webpack;
		},
		created(injection) {
			
		}
	};
}