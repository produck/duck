'use strict';

const Datahub = require('@or-change/data-hub');
const debug = require('debug')('duck:datahub');
const normalize = require('./src/normalizeOptions');

module.exports = function DuckDatahub(modelOptionsList) {
	const finalOptions = normalize(modelOptionsList);

	const Linkers = {};

	return {
		id: 'com.oc.duck.datahub',
		name: 'Datahub',
		description: 'Database middle layout.',
		install(injection) {
			const datahubInjection = injection.$create('Datahub');

			finalOptions.forEach(options => {
				Linkers[options.id] = function DatahubLinker(adaptor) {
					const models = {};

					for (const symbol in options.models) {
						const modelOptions = options.models[symbol](adaptor, datahubInjection);

						modelOptions.symbol = symbol;
						models[symbol] = modelOptions;
					}

					return Datahub.create({
						id: options.id,
						models
					});
				};
			});

			debug('DuckDatahub has handled all models options.');

			injection.Datahub = function link(id, adaptor) {
				debug('Creating a new datahub instance by linker, Id=`%s`.', id);

				const Linker = Linkers[id];

				if (!Linker) {
					throw new Error(`Datahub id='${id}' is NOT defined.`);
				}

				return Linkers[id](adaptor);
			};
		}
	};
};