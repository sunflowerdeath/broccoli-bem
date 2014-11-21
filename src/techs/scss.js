var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')
var sass = require('broccoli-sass')
var path = require('path')
var Funnel = require('broccoli-funnel')

var findDepsFiles = require('../findDepsFiles')
var changeExt = require('../changeExt')

var SUFFIXES = ['mix.scss', 'scss', 'ie8.scss', 'ie9.scss']

function Tree(levelsTree, deps, config) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.config = config
}

Tree.prototype.read = function(readTree) {
	var self = this
	return readTree(this.levelsTree).then(function(levelsDir) {
		//extract mixins to separate tree
		var mixFiles = _.flatten(_.values(findDepsFiles(levelsDir, self.deps, 'mix.scss')))
		var mixTree = new Funnel(levelsDir, {
			files: mixFiles,
			//place all mixins on top level so they can be included by name
			getDestinationPath: function(file) { return path.basename(file) }
		})

		//find all scss files
		var scssFiles = _.flatten(_.map(_.without(SUFFIXES, 'mix.scss'), function(suffix) {
			return _.flatten(_.values(findDepsFiles(levelsDir, self.deps, suffix)))
		}))
		//compile
		var trees = _.map(scssFiles, function(file) {
			var outFile = changeExt(file, 'css')
			return sass([self.levelsTree, mixTree], file, outFile)
		})
		var mergedTree = mergeTrees(_.flatten(trees))
		return readTree(mergedTree)
	})
}

Tree.prototype.cleanup = function() {}

module.exports = {
	preprocessor: true,
	nextTechs: ['css'],
	suffixes: SUFFIXES,
	Tree: Tree
}
