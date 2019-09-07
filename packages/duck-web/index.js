'use strict';

const http = require('http');
const https = require('https');
const debug = require('debug')('duck:web');
const normalize = require('./src/normalizeOptions');

module.exports = function DuckWeb(options) {
	const ApplicationOptionsList = normalize(options);
	const applications = {};

	let ready = false;

	return {
		id: 'com.oc.duck.web',
		name: 'WebApplication',
		description: 'Used to guide developer to create a web application.',
		install(injection) {
			injection.Web = Object.freeze({
				Application(id, ...args) {
					if (!ready) {
						throw new Error('Could NOT instant any application safely now.');
					}

					const Application = applications[id];

					if (!Application) {
						throw new Error(`The application specified with id='${id}' does not exist.`);
					}

					return new Application(...args);
				},
				Http: http,
				Https: https
			});

			debug('Creating all `Application()` factory from `options`.');
			ApplicationOptionsList.forEach(options => {
				debug('Building Application id=`%s`', options.id);
				applications[options.id] = options.Application(injection);
			});
			debug('All factory has been built %s in total.', ApplicationOptionsList.length);
			Object.freeze(applications);
			debug('`Application()` factory store has been freezen. Ready!');
			
		},
		created() {
			ready = true;
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
};