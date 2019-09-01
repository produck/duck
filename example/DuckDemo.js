'use strict';

const Duck = require('../index');
const http = require('http');

function DuckDemo() {
	const duck = {};

	Duck({
		components: [
			Duck.Web([
				{
					id: 'default',
					Application: Duck.Web.Koa({
						
					})
				}
			]),
		],
		
	}, function created({ product, sound, Web, injection }) {
		console.log('hook:created');
		console.log(product.abstract);
		console.log(product.components);

		try {
			injection.test = 1
		} catch (error) {
			console.log(error)
		}

		duck.quack = function () {
			return sound;
		};

		duck.server = http.createServer(Web.Application['default']());
	});

	return duck;
}

const duck = DuckDemo();

console.log(duck.quack());

duck.server.listen(80);