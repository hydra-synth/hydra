"use strict";

var _ = require('lodash');

module.exports = function(mutate, source, options, callback) {
	if (mutate instanceof Function) {
		mutate = [mutate];
	} else if (mutate instanceof Array) {
		mutate = [].concat(mutate).slice().reverse();
	} else {
		mutate = [];
	}

	function next(err, s) {
		process.nextTick(function() {
			if (err) {
				callback(err);
			} else if (mutate.length === 0) {
				callback(null, s);
			} else {
				var n = _.once(next);

				try {
					mutate.pop()(s, options, n);
				} catch (err) {
					n(err);
				}
			}
		});
	}

	next(null, source);
};