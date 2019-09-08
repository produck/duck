'use strict';

module.exports = function DuckLog(options) {
	const loggers = {};

	return {
		id: 'com.orchange.duck.log',
		name: 'DuckLogger',
		install(injection) {
			injection.Log = {

			};
		}
	};
};