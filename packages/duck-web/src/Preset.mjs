function DefaultApplicationProvider({ product }) {
	return function DefaultApplication() {
		return function requestListener(_request, response) {
			response.end(JSON.stringify({
				meta: product.meta,
				components: product.components
			}, null, '  '));
		};
	};
}

function RedirectHttpsApplicationProvider() {
	return function RedirectHttpsApplication() {
		return function requestListener(request, response) {
			if (request.protocol === 'https') {
				throw new Error('RedirectHttps MUST be installed to a http server.');
			}

			response.setHeader(302, {
				'Location': `https://${request.header.host}${request.path}`
			});

			response.end();
		};
	};
}

export {
	DefaultApplicationProvider as Default,
	RedirectHttpsApplicationProvider as Redirect
};