'use strict';

const Protocol = {
	http: require('http'),
	https: require('https')
};

const normalize = require('./normalize');

function ComponentWeb(options) {
	const ApplicationOptionsList = normalize(options);
	const applications = {};
	const servers = {};

	return {
		id: 'com.oc.duck.web',
		name: 'WebApplication',
		description: 'Used to guide developer to create a web application.',
		install(injection) {
			injection.Web = Object.freeze({
				Application: applications,
				servers,
				Server(id, protocolName, requestListener) {
					const server = Protocol[protocolName].createServer(requestListener);

					servers[id] = server;
					server.on('close', () =>  delete servers[id]);

					return server;
				}
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