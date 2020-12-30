'use strict';

const Duck = require('@produck/duck');
const DuckLog = require('../');
const http = require('http');

describe('DuckLog::', function () {
	it('default', function (done) {
		Duck({
			id: 'test',
			components: [
				DuckLog()
			],
		}, ({ Log }) => {
			Log();

			Log.default('111100');
			Log.default.error('111177');
			Log.default.trace('111155');
			Log.default.debug('1111000');
			Log.default.info('1111000');
			done();
		})();
	});

	it.skip('debug', function () {
		Duck({
			id: 'test',
			components: [
				DuckLog({
					default: {
						AppenderList: [
							DuckLog.Appender.Console(),
							DuckLog.Appender.File({
								file: {
									pathname(injection) {
										console.log(injection);

										return 'logs/default.log';
									}
								}
							})
						]
					}
				})
			]
		}, ({ Log }) => {

			Log();

			Log.default('111100');
			Log.default.error('111177');
			Log.default.trace('111155');
			Log.default.debug('1111000');
			Log.default.info('1111000');

			setInterval(() => {
				Log.default('This returns a WritableStream. changes then the current');
			}, 50);
		})();
	});

	it.skip('debug-http-adapter', function () {
		Duck({
			id: 'test',
			components: [
				DuckLog({
					access: {
						format: DuckLog.Format.ApacheCLF()
					}
				})
			],
		}, ({ Log }) => {
			http.createServer(DuckLog.Adapter.HttpServer((req, res) => {
				res.end('ok');
			}, abstract => Log.access(abstract))).listen(8080);
		});
	});
});