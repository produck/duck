'use strict';

function ComponentDatahub(options) {
	const datahubs = {};

	return {
		id: 'com.oc.duck.datahub',
		name: 'Datahub',
		description: 'Database middle layout.',
		install(injection) {
			injection.Datahub = new Proxy();
		},
		created(injection) {

		}
	};
}

module.exports = ComponentDatahub;