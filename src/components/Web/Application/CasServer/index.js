'use strict';

module.exports = function ProductHttpApplicationCasServerProvider() {

	return function ProductHttpApplicationCasServer(injection) {
		return {
			type: 'com.oc.http.CasServer',
			RequestListener() {

			}
		};
	};
};