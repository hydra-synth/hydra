"use strict";

module.exports = function(s) {
	return s && typeof s.pipe === 'function';
};