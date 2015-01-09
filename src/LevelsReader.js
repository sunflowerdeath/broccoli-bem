var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')
var sieve = require('broccoli-file-sieve')

var makeDepsGlobs = require('./makeDepsGlobs')

/**
 * Prepares tree for tech builder.
 * Copies files of specific tech matching to deps from levels dirs to new tree.
 * Levels dirs names are incremented from '0'.
 * @param levels {Array.<string>} Levels paths.
 * @param deps {Deps} Bem deps object.
 * @param suffixes {array.<string>} Suffixes of tech files.
 */
var LevelsReader = function(levels, deps, suffixes) {
	if (!(this instanceof LevelsReader)) return new LevelsReader(levels, deps, suffixes)
	this.levels = levels
	this.deps = deps
	this.suffixes = suffixes
}

LevelsReader.prototype.read = function(readTree) {
	var levelsTrees = _.map(this.levels, function(level, index) {
		var globs = makeDepsGlobs(this.deps, this.suffixes, true)
		return sieve(level, {
			files: globs,
			destDir: index + ''
		})
	}, this)
	var mergedTree = mergeTrees(levelsTrees)
	return readTree(mergedTree)
}

LevelsReader.prototype.cleanup = function() {}

module.exports = LevelsReader
