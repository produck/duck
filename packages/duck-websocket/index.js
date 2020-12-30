'use strict';

const WebSocket = require('ws');

function DefaultHandler({ product }) {
	return function defaultHandler(ws) {
		ws.send(JSON.stringify(product));
	};
}

function DefaultUpgradeFilter() {
	return function defaultUpgradeFilter(_request, _socket, _head, next) {
		next();
	};
}

function normalize(options) {
	const finalOptions = {
		UpgradeFilter: DefaultUpgradeFilter,
		Handler: DefaultHandler
	};

	const {
		UpgradeFilter: _UpgradeFilter = finalOptions.UpgradeFilter,
		Handler: _Handler = finalOptions.Handler
	} = options;

	finalOptions.UpgradeFilter = _UpgradeFilter;
	finalOptions.Handler = _Handler;

	return finalOptions;
}

module.exports = function PlumberhubWebSocket(options) {
	const finalOptions = normalize(options);

	let websocketInjection = null;

	function attach(server) {
		const handler = finalOptions.Handler(websocketInjection);
		const filter = finalOptions.UpgradeFilter(websocketInjection);

		const wss = new WebSocket.Server({
			noServer: true
		}).on('connection', handler);

		server.on('upgrade', async function upgrade(request, socket, head) {
			let continued = false;
			const context = {
				request, socket, head,
				state: {}
			};

			function next() {
				continued = true;

				wss.handleUpgrade(request, socket, head, websocket => {
					context.websocket = websocket;
					wss.emit('connection', context);
				});
			}

			await filter(context, next);

			if (continued === false) {
				socket.destroy();
			}
		});
	}

	return {
		id: 'org.produck.websocket',
		name: 'websockets binder',
		install({ injection }) {
			injection.WebSocket = { attach };
		},
		created(installedInjection) {
			websocketInjection = installedInjection.$create('PlumberhubWebSocket');
		}
	};
};
