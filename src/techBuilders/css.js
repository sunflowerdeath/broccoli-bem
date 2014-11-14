var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')
var concat = require('broccoli-concat')
var path = require('path')

var findDepsFiles = require('../findDepsFiles')

var SUFFIXES = ['css', 'ie8.css', 'ie9.css']

function Tree(levelsTree, deps, config) {
  if (!(this instanceof Tree)) return new Tree(levelsTree, deps, config)
	this.levelsTree = levelsTree
	this.deps = deps
	this.config = config
}

Tree.prototype.read = function(readTree) {
	var self = this
	return readTree(this.levelsTree)
		.then(function(levelsDir) {
			var trees = _.map(SUFFIXES, function(suffix) {
				var depsFiles = findDepsFiles(levelsDir, self.deps, suffix)
				return _.map(depsFiles, function(files, moduleName) {
					var outputFile = path.join('/styles', moduleName + '.' + suffix).replace(/\\/g, '/')
					return concat(levelsDir, {
						inputFiles: files,
						outputFile: outputFile,
						wrapInFunction: false
					})
				})
			})
			var mergedTree = mergeTrees(_.flatten(trees))
			return readTree(mergedTree)
		})
}

Tree.prototype.cleanup = function() {}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
