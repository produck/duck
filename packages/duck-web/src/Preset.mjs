import http from 'node:http';

function DefaultApplicationProvider({ product }) {
	return function DefaultApplication() {
		return function requestListener(_request, response) {
			response.setHeader('Content-Type', 'application/json');
			response.end(JSON.stringify(product, null, '  '));
		};
	};
}

const isHttpServer = any => any instanceof http.Server;

function RedirectHttpsApplicationProvider() {
	return function RedirectHttpsApplication(code = 302) {
		return function requestListener(request, response) {
			if (!isHttpServer(request.socket.server)) {
				throw new Error('RedirectHttps MUST be installed to a http server.');
			}

			const location = `https://${request.headers.host}${request.url}`;

			response.setHeader('Location', location);
			response.statusCode = code;
			response.end();
		};
	};
}

export {
	DefaultApplicationProvider as Default,
	RedirectHttpsApplicationProvider as RedirectHttps,
};
