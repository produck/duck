'use strict';

const apache = require('./utils/apache');

module.exports = function ApacheCommonLogFormatWithVirtualHost() {
	return function format(meta, message) {
		const _ = message;
		const _t = apache.getDefaultTimeString(meta.time);

		// %v %h %l %u %t "%r" %>s %b
		return `${_.v} ${_.h} ${_.l} ${_.u} ${_t} "${_.r}" ${_.s} ${_.b}`;
	};
};