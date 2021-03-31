'use strict';

const DuckLog = require('../');
const assert = require('assert');

describe('DuckLog::', function () {
	describe('constructor()', function () {
		it('should create a component without any options.', function () {
			DuckLog();
		});

		it('should create a component with static options.', function () {
			DuckLog({});
		});

		it('should create a component with static options with a simple category.', function () {
			DuckLog({ simple: true });
			DuckLog({ simple: {} });
		});

		it('should create a component with static options by full category style.', function () {
			DuckLog({
				full: {
					label: 'test',
					format: (meta, message) => meta + message,
					levels: ['info', 'error'],
					AppenderList: [
						function CustomAppender() {
							return { write: message => message };
						}
					],
					preventLevels: ['error'],
					defaultLevel: 'info'
				}
			});
		});

		it('should throw an error if a simple category is NOT `true` or an object.', function () {
			assert.throws(() => { DuckLog({ simple: false }); });
			assert.throws(() => { DuckLog({ simple: null }); });
			assert.throws(() => { DuckLog({ simple: 1 }); });
			assert.throws(() => { DuckLog({ simple: 'a' }); });
			assert.throws(() => { DuckLog({ simple: undefined }); });
			assert.throws(() => { DuckLog({ simple: () => {} }); });
		});

		it('should create a component with static options by full category style.', function () {
			assert.throws(() => {
				DuckLog({
					full: {
						levels: ['info', 'error'],
						preventLevels: ['error'],
						defaultLevel: 'notExisted'
					}
				});
			});

			assert.throws(() => {
				DuckLog({
					full: {
						levels: ['info', 'error'],
						preventLevels: ['notExisted'],
						defaultLevel: 'error'
					}
				});
			});

			assert.throws(() => { DuckLog({ full: { label: 1 } }); });
			assert.throws(() => { DuckLog({ full: { format: 1 } }); });
			assert.throws(() => { DuckLog({ full: { levels: 1 } }); });
			assert.throws(() => { DuckLog({ full: { levels: [] } }); });
			assert.throws(() => { DuckLog({ full: { levels: [1] } }); });
			assert.throws(() => { DuckLog({ full: { AppenderList: 1 } }); });
			assert.throws(() => { DuckLog({ full: { AppenderList: [3] } }); });
			assert.throws(() => { DuckLog({ full: { preventLevels: 1 } }); });
			assert.throws(() => { DuckLog({ full: { defaultLevel: null } }); });
			assert.throws(() => { DuckLog({ full: { defaultLevel: 2 } }); });
		});
	});


});