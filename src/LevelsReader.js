var _ = require('underscore')
var path = require('path')
var Funnel = require('broccoli-funnel')
var mergeTrees = require('broccoli-merge-trees')

var findTechFiles = require('./findTechFiles')
var matchDepsWithFiles = require('./matchDepsWithFiles')

/**
 * Reads tech files matching to deps from levels to tree.
 * @param {Array.<string>} levels - Levels paths.
 * @param {Deps} deps - Bem deps object.
 * @param {string} suffix - Suffix of tech files.
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
