'use strict';

module.exports = function RedirectHttpsApplicationProvider() {
	return function RedirectHttpsApplication() {
		return function requestListener(request, response) {
			if (request.protocol === 'https') {
				throw new Error('This appliction MUST NOT be installed to a https server.');
			}

			const location = `https://${request.header.host}${request.path}`;

			response.setHeader(302, { 'Location': location });
			response.end();
		};
	};
};
