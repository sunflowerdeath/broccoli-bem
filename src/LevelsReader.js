var _ = require('underscore')
var path = require('path')
var Funnel = require('broccoli-funnel')
var mergeTrees = require('broccoli-merge-trees')

var findTechFiles = require('./findTechFiles')
var matchDepsWithFiles = require('./matchDepsWithFiles')

/**
 * Prepares tree for tech builder.
 * Copies files of specific tech matching to deps from levels dirs to new tree.
 * Levels dirs names are incremented from '0'.
 * @param levels {Array.<string>} Levels paths.
 * @param deps {Deps} Bem deps object.
 * @param suffix {string} Suffix of tech files.
 */
var LevelsReader = function(levels, deps, suffix) {
	if (!(this instanceof LevelsReader)) return new LevelsReader(levels, deps, suffix)
	this.levels = levels
	this.deps = deps
	this.suffix = suffix
}

LevelsReader.prototype.read = function(readTree) {
	var self = this
	var levelsTrees = _.map(this.levels, function(level, index) {
		var files = findTechFiles(level, self.suffix)
		var matchedFiles = _.flatten(_.values(matchDepsWithFiles(self.deps, files)))
		return new Funnel(level, {
			destDir: index + '',
			files: _.map(matchedFiles, function(file) {
				return path.relative(level, file)
			})
		})
	})
	var mergedTree = mergeTrees(levelsTrees)
	return readTree(mergedTree)
}

LevelsReader.prototype.cleanup = function() {}

module.exports = LevelsReader
