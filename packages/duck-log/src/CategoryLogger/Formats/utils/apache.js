'use strict';

const dateFormat = require('dateformat');

exports.getDefaultTimeString = function getDefaultTimeString(date) {
	// return `[21/Apr/2019:18:44:33 +0800]`;
	return dateFormat(date, '[dd/mmm/yyyy:HH:MM:ss o]');
};