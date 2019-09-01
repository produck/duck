'use strict';

const normalize = require('./normalize');

function ComponentDatahub(datahubOptions) {
	const Datahub = require('@or-change/data-hub');

	datahubOptions = normalize(datahubOptions);

	const datahubs = {};

	return {
		id: 'com.oc.duck.datahub',
		name: 'Datahub',
		description: 'Database middle layout.',
		install(injection) {
			datahubOptions.forEach(options => {
				const models = {};
		
				for (const symbol in options.models) {
					const modelOptions = options.models[symbol](injection);
		
					modelOptions.symbol = symbol;
					models[symbol] = modelOptions;
				}
		
				datahubs[options.alias] = Datahub.create({
					id: options.id,
					models
				});
			});
			
			injection.datahubs = datahubs;
			Object.freeze(datahubs);
		}
	};
}

module.exports = ComponentDatahub;