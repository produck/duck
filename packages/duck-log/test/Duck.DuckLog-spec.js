'use strict';

const assert = require('assert');
const Duck = require('@produck/duck');
const DuckLog = require('../');

describe('Duck::', function () {
	describe('DuckLog::', function () {
		it('should inject into a product.', function (done) {
			Duck({
				id: 'com.produck.ducklog.test',
				components: [DuckLog()]
			}, function Test({ Log }) {
				assert(Log);
				done();
			})();
		});

		it('should create a category by simple options in static.', function (done) {
			const MESSAGE_REG =
				/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] \[test\]: hello$/;

			Duck({
				id: 'com.produck.ducklog.test',
				components: [
					DuckLog({ test: true })
				]
			}, async function Test({ Log }) {
				const message = await Log.test('hello');

				assert(MESSAGE_REG.test(message));
				done();
			})();
		});

		it('should create a category by full options in static.', function (done) {
			const result = {};

			Duck({
				id: 'com.produck.ducklog.test',
				components: [
					DuckLog({
						foo: {
							label: 'not-foo',
							levels: ['info', 'error'],
							format: (meta, message) => [
								meta.level, meta.label, message
							].join('|'),
							AppenderList: [
								function CustomFooAppender() {
									let index = 0;

									return {
										write(message) {
											result[`foo-msg-${index}`] = message;
											index++;
										}
									};
								}
							],
							defaultLevel: 'info'
						},
						bar: {
							label: 'not-bar',
							levels: ['info', 'error'],
							format: (meta, message) => [
								meta.level, meta.label, message
							].join('|'),
							AppenderList: [
								function CustomBarAppender() {
									let index = 0;

									return {
										write(message) {
											result[`bar-msg-${index}`] = message;
											index++;
										}
									};
								}
							],
							defaultLevel: 'error',
							preventLevels: ['info']
						},
						baz: {
							levels: ['warn', 'info', 'error'],
							format: (meta, message) => [
								meta.level, meta.label, message
							].join('|'),
							AppenderList: [
								function CustomBazAppender() {
									return {
										write(message) {
											result['baz-msg'] = message;
										}
									};
								}
							],
						}
					})
				]
			}, async function Test({ Log }) {
				await Log.foo('hello0');
				await Log.foo.info('hello1');
				await Log.foo.error('hello2');

				await Log.bar('world0');
				await Log.bar.info('world1'); // silent
				await Log.bar.error('world2');

				await Log.baz('default');

				assert.deepStrictEqual(result, {
					'foo-msg-0': 'info|not-foo|hello0',
					'foo-msg-1': 'info|not-foo|hello1',
					'foo-msg-2': 'error|not-foo|hello2',
					'bar-msg-0': 'error|not-bar|world0',
					'bar-msg-1': 'error|not-bar|world2',
					'baz-msg': 'warn|baz|default',
				});

				done();
			})();
		});

		describe('Append Category Logger::', function () {
			it('should be apppended a new category logger only by category name.', function (done) {
				Duck({
					id: 'com.produck.ducklog.test',
					components: [
						DuckLog({ test: true })
					]
				}, async function Test({ Log }) {
					Log('test2');

					assert(typeof Log.test === 'function');
					assert(typeof Log.test2 === 'function');
					assert(typeof Log.test2.info === 'function');
					assert(typeof Log.test2.error === 'function');
					assert(typeof Log.test2.warn === 'function');

					done();
				})();
			});

			it('should be apppended a new category logger by category name & options.', function (done) {
				Duck({
					id: 'com.produck.ducklog.test',
					components: [
						DuckLog({ test: true })
					]
				}, async function Test({ Log }) {
					Log('test2', {
						label: 'hehe'
					});

					assert(typeof Log.test === 'function');
					assert(typeof Log.test2 === 'function');
					assert(typeof Log.test2.info === 'function');
					assert(typeof Log.test2.error === 'function');
					assert(typeof Log.test2.warn === 'function');

					done();
				})();
			});

			it('should throw an error if apppend a same name category logger.', function (done) {
				Duck({
					id: 'com.produck.ducklog.test',
					components: [
						DuckLog({ test: true })
					]
				}, async function Test({ Log }) {
					assert.throws(() => Log('test'));
					done();
				})();
			});

			it('should throw an error if setting property to LogInjection.', function (done) {
				Duck({
					id: 'com.produck.ducklog.test',
					components: [
						DuckLog({ test: true })
					]
				}, async function Test({ Log }) {
					assert.throws(() => Log.a = 1);
					done();
				})();
			});

			it('should throw an error if try to access a non-existed category logger.', function (done) {
				Duck({
					id: 'com.produck.ducklog.test',
					components: [
						DuckLog({ test: true })
					]
				}, async function Test({ Log }) {
					await Log.test('some');
					assert.throws(() => Log.a);
					done();
				})();
			});
		});
	});
});