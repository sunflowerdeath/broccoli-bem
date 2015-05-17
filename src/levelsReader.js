var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')
var sieve = require('broccoli-file-sieve')

var makeDepsGlobs = require('./makeDepsGlobs')

/**
 * Prepares tree for tech builder.
 * Copies files of specific tech matching to deps from levels dirs to new tree.
 * Levels dirs names are incremented from '0'.
 * @param levels {array.<string>} Levels paths.
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
		// First find all suffix files for performance optimisation
		var suffixGlobs = this.suffixes.map(function(suffix) { return '**/*.' + suffix })
		var suffixSieve = sieve(level, {files: suffixGlobs})

		var depsGlobs = makeDepsGlobs(this.deps, this.suffixes, true)

		// Remove ':' and replace '..' with two dots symbol,
		// because windows don't like it.
		var name = level.slice(-30)
			.replace(/:/g, '')
			.replace(/\.\./g, '\u2025')
		if (level.length > 30) name = '~' + name

		var destDir = String(index) + '-' + name
		return sieve(suffixSieve, {
			files: depsGlobs,
			destDir: destDir
		})
	}, this)
	var mergedTree = mergeTrees(levelsTrees)
	return readTree(mergedTree)
}

LevelsReader.prototype.cleanup = function() {}

module.exports = LevelsReader
