"use strict";

module.exports = function(pending) {
	for (var i = 0, max = pending.length; i < max; ++i) {
		pending[i]();
	}

	pending.length = 0;
};