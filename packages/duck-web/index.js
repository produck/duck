'use strict';

const debug = require('debug')('duck:web');
const normalize = require('./src/normalizeOptions');
const Application = require('./src/Application');

module.exports = Object.assign(function DuckWeb(options) {
	const ApplicationOptionsList = normalize(options);
	const applications = {};

	return {
		id: 'org.produck.web',
		name: 'WebApplication',
		description: 'Used to guide developer to create a web application.',
		install(injection) {
			injection.Web = {
				Application(id, ...args) {
					const Application = applications[id];

					if (!Application) {
						throw new Error(`The application specified with id='${id}' does not exist.`);
					}

					return new Application(...args);
				},
			};
		},
		created(installedInjection) {
			const duckWebInjection = installedInjection.$create('DuckWeb');

			debug('Creating all `Application()` factory from `options`.');

			ApplicationOptionsList.forEach(options => {
				const injection = duckWebInjection.$create(`DuckWeb.Application<${options.id}>`);

				debug('Building Application id=`%s`', options.id);
				applications[options.id] = options.Application(injection);
			});

			debug('All factory has been built %s in total.', ApplicationOptionsList.length);
		},
		getDetails() {
			return {
				applications: ApplicationOptionsList.map(options => {
					return {
						id: options.id,
						description: options.description
					};
				})
			};
		}
	};
}, {
	Application
});
