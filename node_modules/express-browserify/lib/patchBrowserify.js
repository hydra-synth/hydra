"use strict";

var _ = require('lodash');
var registry = {};

module.exports = function(browserify) {
	browserify.require = _.wrap(browserify.require, function(require, file, opts) {
		if (file instanceof Object && !(file instanceof Array)) {
			file = [file];
		}

		return require.call(this, file, opts);
	});

	browserify.ignore = _.wrap(browserify.ignore, function(ignore, file, opts) {
		if (file instanceof Array) {
			for (var i = 0, max = file.length; i < max; ++i) {
				this.ignore(file[i], opts);
			}

			return this;
		}

		ignore.call(this, file, opts);

		return this;
	});

	browserify.exclude = _.wrap(browserify.exclude, function(exclude, file, opts) {
		if (file instanceof Array) {
			for (var i = 0, max = file.length; i < max; ++i) {
				this.exclude(file[i], opts);
			}

			return this;
		}

		if (file instanceof Object) {
			if (file.expose != null) {
				file = file.expose;
			} else if (file.file != null) {
				file = file.file;
			}
		}

		exclude.call(this, file, opts);

		return this;
	});

	browserify.external = _.wrap(browserify.external, function(external, file, opts) {
		if (typeof file === 'string' && registry.hasOwnProperty(file)) {
			file = registry[file];
		}

		external.call(this, file, opts);

		return this;
	});

	browserify.register = function(name) {
		registry[name] = this;
		return this;
	};

	return browserify;
};