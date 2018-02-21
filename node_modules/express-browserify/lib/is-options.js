"use strict";

module.exports = function(value) {
	return value instanceof Object && !(value instanceof Function);
};