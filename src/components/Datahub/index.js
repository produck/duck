'use strict';

const normalize = require('./normalize');

function ComponentDatahub(datahubOptions) {
	const Datahub = require('@or-change/data-hub');

	datahubOptions = normalize(datahubOptions);

	const context = {};
	const Linkers = {};

	return {
		id: 'com.oc.duck.datahub',
		name: 'Datahub',
		description: 'Database middle layout.',
		install(injection) {
			datahubOptions.forEach(options => {
				Linkers[options.id] = function DatahubLinker(adaptor) {
					const models = {};
			
					for (const symbol in options.models) {
						const modelOptions = options.models[symbol](adaptor, injection, context);
			
						modelOptions.symbol = symbol;
						models[symbol] = modelOptions;
					}
			
					return Datahub.create({
						id: options.id,
						models
					});
				};
			});

			injection.Datahub = function link(id, adaptor) {
				const Linker = Linkers[id];

				if (!Linker) {
					throw new Error(`Datahub id='${id}' is NOT defined.`);
				}

				return Linkers[id](adaptor);
			};

			Object.freeze(Linkers);
			Object.freeze(context);
		}
	};
}

module.exports = ComponentDatahub;