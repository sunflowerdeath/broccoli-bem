var _ = require('underscore')

var makeSuffixGlobs = function(deps, suffix) {
	var globs = {}
	_.each(deps, function(bundleDeps, bundleName) { 
		globs[bundleName] = _.map(bundleDeps, function(dep) {
			return '**/' + dep + '.' + suffix
		})
	})
	return globs
}

/**
 * Makes glob patterns for all possible dependencies files.
 *
 * @param deps {object} Bem deps.
 * @param suffixes {array.<string>} List of tech suffixes.
 * @return Object with array of globs for each module.
 */
var makeDepsGlobs = function(deps, suffixes, flatten) {
	if (!Array.isArray(suffixes)) throw new Error('argument "suffixes" must be an array')
	var globs = {}
	_.each(suffixes, function(suffix) {
		globs[suffix] = makeSuffixGlobs(deps, suffix) 
	})
	if (flatten) {
		globs = _.flatten(_.map(globs, function(suffixGlobs) {
			return _.values(suffixGlobs)
		}))
	}
	return globs
}

module.exports = makeDepsGlobs
