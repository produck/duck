'use strict';

const normalize = require('./normalize');

function ComponentWeb(options) {
	const ApplicationOptionsList = normalize(options);
	const applications = {};

	return {
		id: 'com.oc.duck.web',
		name: 'WebApplication',
		description: 'Used to guide developer to create a web application.',
		install(injection) {
			injection.Web = Object.freeze({
				Application: applications
			});
		},
		created(injection) {
			ApplicationOptionsList.forEach(options => {
				applications[options.id] = options.Application(injection);
			});

			Object.freeze(applications);
		}
	};
}

ComponentWeb.Koa = require('./Application/Koa');

module.exports = ComponentWeb;