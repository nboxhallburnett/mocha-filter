/**
 * The following code is for adding mocha filters, these filters
 * will add a clean way to skip tests based on a predefined scenario.
 *
 * Add commonly used filters to the checks variable below, and any other
 * test-specific filters should be defined in the applicable test using
 * the addFilter() method.
 */

// Predefined additional filters
var checks = {
		ignore: function () {
			return false;
		}
	},
	originalChecks = Object.keys(checks);

module.exports = function (defaults) {
	if (typeof defaults !== 'undefined' && typeof defaults !== 'object') {
		throw new Error('Error: default filters should be an object');
	}
	// Add the ignore filter to the provided defaults object if it isn't already defined in it
	!defaults.ignore && (defaults.ignore = checks.ignore);
	checks = defaults;
	module.exports.setupMocha();
}

/**
 * Adding filters to mocha tests does not persist across test
 * files, so any tests making use of the functions must call
 * this function to set them.
 */
module.exports.setupMocha = function (_checks, skipOriginals) {
	if (!_checks) {
		_checks = checks;
	} else if (!skipOriginals) {
		for (var key in checks) {
			_checks[key] = checks[key];
		}
	}

	var functions = [describe, it, before, after, beforeEach, afterEach];

	/**
	 * Process the checks
	 */
	function ext(func, notFailed) {
		var check = this,
			returnFunction = {};

		/**
		 * Parse the provided functions
		 */
		var parseFunctions = function (_key) {
			/**
			 * Function to return when the checks have been processed
			 */
			returnFunction[_key] = function () {
				var passed = _checks[_key]();
				if (arguments.length > 0) {
					if (passed === 'skip' && notFailed) {
						func.skip.apply(null, arguments);
					} else if (passed && notFailed) {
						func.apply(null, arguments);
					}
				} else {
					return ext(func, passed && notFailed);
				}
			};
		};

		for (var key in _checks) {
			parseFunctions(key);
		}
		return returnFunction;
	}

	/**
	 * Populate the functions with the new checks
	 */
	var populateFunctions = function (_i, _extension) {
		functions[_i][_extension] = extensions[_extension];
	};

	for (var i in functions) {
		var extensions = ext(functions[i], true);
		for (var extension in extensions) {
			populateFunctions(i, extension);
		}
	}
};

/**
 * Add a new filter to the mocha functions. The predefined filters
 * cannot be overwritten, but user-defined ones can.
 *
 * @param name      The name of the filter, which will be used in the test
 * @param filter    The function that will determine whether to run the test
 */
module.exports.addFilter = function (name, filter) {
	if (originalChecks.indexOf(name) > -1) {
		return false;
	}
	checks[name] = filter;
	var obj;
	module.exports.setupMocha((obj = {}, obj[name] = filter, obj), true);
};

/**
 * Add mutliple filters at once
 *
 * @param filters    Object containing the filters to add
 */
module.exports.addFilters = function (filters) {
	var keys = Object.keys(filters);
	for (var i = 0; i < keys.length; i++) {
		module.exports.addFilter(keys[i], filters[keys[i]]);
	}
}
