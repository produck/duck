'use strict';

const { Normalizer } = require('@or-change/duck');
const schema = require('./OptionsSchema.json');

module.exports = Normalizer(schema, options => options === null ? [] : options);