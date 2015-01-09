var _ = require('underscore')

var makeSuffixGlobs = function(deps, suffix) {
	var globs = {}
	_.each(deps, function(moduleDeps, moduleName) { 
		globs[moduleName] = _.map(moduleDeps, function(dep) {
			return '**/' + dep + '.' + suffix
		})
	})
	return globs
}

/**
 * Makes glob patterns for all possible dependencies files.
 * @param deps {object} Bem deps.
 * @param suffixes {array.<string>} List of tech suffixes.
 * @return Object with array of globs for each module.
 */
var makeDepsGlobs = function(deps, suffixes, flatten) {
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