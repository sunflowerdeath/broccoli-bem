var _ = require('underscore')

var makeSuffixDepsGlobs = function(deps, suffix, flatten) {
	var globs = {}
	_.each(deps, function(bundleDeps, bundleName) { 
		globs[bundleName] = _.map(bundleDeps, function(dep) {
			return '**/' + dep + '.' + suffix
		})
	})
	if (flatten) globs = _.flatten(_.values(globs))
	return globs
}

/**
 * Makes glob patterns for all possible dependencies files.
 * @param deps {object} Bem deps.
 * @param suffixes {string|array.<string>} List of tech suffixes.
 * @return Object with array of globs for each bundle.
 *   When suffixes is array, it returns object with results for every suffix.
 */
var makeDepsGlobs = function(deps, suffixes, flatten) {
	if (!Array.isArray(suffixes)) {
		return makeSuffixDepsGlobs(deps, suffixes, flatten)
	}

	var globs = {}
	_.each(suffixes, function(suffix) {
		globs[suffix] = makeSuffixDepsGlobs(deps, suffix, flatten) 
	})
	if (flatten) globs = _.flatten(_.values(globs))
	return globs
}

module.exports = makeDepsGlobs
