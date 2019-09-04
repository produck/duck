'use strict';

const Duck = require('@or-change/duck');
const DuckDatahub = require('../index');
const assert = require('assert');

const Account = function Account(adaptor, injection, context) {
	return {
		schemas: {
			type: 'object',
			properties: {
				administrator: { type: 'boolean' },
				id: { type: 'string' },
				name: { type: 'string' },
				email: { type: 'string' },
				avatar: { type: 'string' }
			},
			allowNull: ['email']
		},
		methods: {
			create(payload) {
				return adaptor.create(payload);
			},
			delete(payload) {
				return adaptor.delete(payload);
			},
			update(items) {
				return adaptor.updateAccount(this.id, items);
			},
			query(accountId) {
				return adaptor.getAccountById(accountId);
			}
		}
	};
};

describe('Datahub Component::', function() {
	describe('constructor()', function () {
		it('should be created successfully with correct options.', function () {
			DuckDatahub();
			DuckDatahub([]);
			DuckDatahub([{ id: 'test', models: {} }]);
		});

		it('should throw error with bad options.', function () {
			assert.throws(() => DuckDatahub([null]));
			assert.throws(() => DuckDatahub([{}]));
			assert.throws(() => DuckDatahub([{ id: 2 }]));
		});
	});

	describe('Dependence Datahub::', function () {
		it('should be accessed in `options.installed`.', function (done) {
			Duck({
				id: '',
				components: [
					DuckDatahub()
				],
				installed({ Datahub }) {
					assert(Datahub);
					done();
				}
			});
		});

		it('should be accessed in `callback`.', function (done) {
			Duck({
				id: '',
				components: [
					DuckDatahub()
				]
			}, ({ Datahub }) => {
				assert(Datahub);
				done();
			});
		});

		it('should accessing an existed linker successfully.', function () {
			Duck({
				id: 'com.oc.DuckDatahub',
				components: [
					DuckDatahub([
						{
							id: 'com.oc.duck.test',
							models: { Account }
						}
					])
				],
				installed({ Datahub }) {
					Datahub('com.oc.duck.test');
				}
			});
		});

		it('should throw error if accessing linker not defined.', function () {
			Duck({
				id: 'com.oc.DuckDatahub',
				components: [
					DuckDatahub([
						{
							id: 'com.oc.duck.test',
							models: { Account }
						}
					])
				],
				installed({ Datahub, injection }) {
					assert.throws(() => {
						injection.Model = Datahub('test', {}).model;
					}, {
						message: 'Datahub id=\'test\' is NOT defined.'
					});
				}
			});
		});

		it('should instant a datahub with linker by any adaptor.', function (done) {
			Duck({
				id: 'com.oc.DuckDatahub',
				components: [
					DuckDatahub([
						{
							id: 'com.oc.duck.test',
							models: {
								Account(adaptor, injection, context) {
									assert.equal(adaptor.foo, 'bar');
									assert(injection);
									assert(context);
									done();

									return {
										schemas: {
											type: 'object',
											properties: {
												administrator: { type: 'boolean' },
												id: { type: 'string' },
												name: { type: 'string' },
												email: { type: 'string' },
												avatar: { type: 'string' }
											},
											allowNull: ['email']
										}
									};
								}
							}
						}
					])
				],
				installed({ Datahub }) {
					Datahub('com.oc.duck.test', { foo: 'bar' });
				}
			});
		});
	});
});