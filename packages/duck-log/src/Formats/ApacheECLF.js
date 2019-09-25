'use strict';

const apache = require('./utils/apache');

module.exports = function ApacheExtendedCommonLogFormat() {
	return function format(meta, message) {
		const _ = message;
		const _t = apache.getDefaultTimeString(meta.time);

		// %h %l %u %t "%r" %>s %b "%{Referer}i" "%{User-agent}i"
		return `${_.h} ${_.l} ${_.u} ${_t} "${_.r}" ${_.s} ${_.b} "${_.i('Referer')}" "${_.i('User-agent')}"`;
	};
};
