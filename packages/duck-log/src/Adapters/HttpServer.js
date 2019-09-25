'use strict';

function ConnectionAbstract(req, res, time) {
	const { address, port } = req.connection.server.address();

	return {
		get a() {
			return req.connection.remoteAddress;
		},
		get A() {
			return address;
		},
		get B() {
			const value = req.headers['content-length'];

			return value === undefined ? 0 : value;
		},
		get b() {
			const value = req.headers['content-length'];

			return value === undefined ? '-' : value;
		},
		get C() {
			throw new Error('Not supported');
		},
		get D() {
			throw new Error('Not supported');
		},
		e(key) {
			return process.env[key];
		},
		get f() {
			throw new Error('Not supported');
		},
		get h() {
			return req.connection.remoteAddress;
		},
		get H() {
			throw new Error('Not supported');
		},
		i(name) {
			const value = req.headers[name.toLowerCase()];

			if (value === undefined) {
				return '-';
			}

			return value;
		},
		get l() {
			return '-';
		},
		get m() {
			return req.method;
		},
		get n() {
			throw new Error('Not supported');
		},
		o(name) {
			if (!res.hasHeader(name)) {
				return '-';
			}

			return res.getHeader(name);
		},
		get p() {
			return port;
		},
		get P() {
			return process.pid;
		},
		get r() {
			return `${req.method} ${req.url} HTTP/${req.httpVersion}`;
		},
		get s() {
			return res.statusCode;
		},
		get T() {
			return time;
		},
		get u() {
			return '-';
		},
		get U() {
			return new URL(req.url, 'http://example').pathname;
		},
		get v() {
			return '-';
		},
		get V() {
			return '-';
		},
		get X() {
			throw new Error('Not supported');
		}
	};
}

const DEFAULT_CALLBACK = console.log.bind(console);

module.exports = function HttpServerLogAdapter(requestListener, callback = DEFAULT_CALLBACK) {
	return function requestListenerWithLog(req, res) {
		const start = Date.now();

		res.once('finish', () => {
			callback(ConnectionAbstract(req, res, Date.now() - start));
		});

		return requestListener(req, res);
	};
};