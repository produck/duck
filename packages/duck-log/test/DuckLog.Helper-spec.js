'use strict';

const http = require('http');
const assert = require('assert');
const Duck = require('@produck/duck');
const DuckLog = require('../');

describe('DuckLog.Helper::', function () {
	describe('Appender::', function () {
		it('should output log message by some appenders.', function (done) {
			Duck({
				id: 'com.produck.ducklog.test',
				components: [
					DuckLog({
						test: {
							AppenderList: [
								DuckLog.Appender.Stderr,
								DuckLog.Appender.Stdout
							]
						}
					})
				]
			}, async function Test({ Log }) {
				await Log.test('hello');
				done();
			})();
		});
	});

	describe('Format::', function () {

	});

	describe('Adapter::', function () {
		describe('HttpServer::', function () {

			it('should output a access log', function () {
				Duck({
					id: 'test',
					components: [
						DuckLog({
							access: {
								format(_meta, message) {
									message.a;
									message.A;
									message.b;
									message.B;
									assert.throws(() => message.C);
									assert.throws(() => message.D);
									message.e('some');
									assert.throws(() => message.f);
									message.h;
									assert.throws(() => message.H);
									message.i('host');
									message.l;
									message.m;
									assert.throws(() => message.n);
									message.o('set-cookie');
									message.p;
									message.P;
									message.r;
									message.s;
									message.T;
									message.u;
									message.U;
									message.v;
									message.V;
									assert.throws(() => message.X);
								},
								AppenderList: []
							}
						})
					],
				}, ({ Log }) => {
					Log();

					(function () {
						const server = http.createServer(DuckLog.Adapter.HttpServer((req, res) => {
							res.end('ok');
							server.close();
						}, abstract => Log.access(abstract))).listen(8080);

						http.get('http://127.0.0.1:8080');
					}());

					(function () {
						const server = http.createServer(DuckLog.Adapter.HttpServer((req, res) => {
							res.end('ok');
							server.close();
						})).listen(8081);

						http.get('http://127.0.0.1:8081');
					}());

				})();
			});

		});
	});
});