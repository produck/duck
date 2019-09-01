'use strict';

function MultipleSelector(options) {
	const selectors = {};

	for (const typeName in options) {
		selectors[typeName] = options[typeName];
	}

	return function modelMethod({
		selector: type,
		args
	}, Models) {
		return selectors[type].call(this, args, Models);
	};
}


module.exports = MultipleSelector;