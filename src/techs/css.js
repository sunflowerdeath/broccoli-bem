var _ = require('underscore')
var path = require('path')
var mergeTrees = require('broccoli-merge-trees')

var makeDepsGlobs = require('../makeDepsGlobs')
var Concat = require('../plugins/concat')

var SUFFIXES = ['css', 'ie8.css', 'ie9.css']

function Tree(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options
}

Tree.prototype.description = 'Css tech'

Tree.prototype.read = function(readTree) {
	if (!this.cachedTree) {
		var depsGlobs = makeDepsGlobs(this.deps, SUFFIXES)
		this.cachedTree = this.createTree(depsGlobs)
	}
	return readTree(this.cachedTree)
}

Tree.prototype.createTree = function(depsGlobs) {
	var _this = this
	var trees = _.flatten(_.map(depsGlobs, function(suffixGlobs, suffix) {
		return _.map(suffixGlobs, function(moduleGlobs, moduleName) {
			return _this.createConcat(moduleGlobs, moduleName, suffix)
		})
	}))
	return mergeTrees(trees)
}

Tree.prototype.createConcat = function(globs, moduleName, suffix) {
	var dest = path.join('styles', moduleName + '.' + suffix)
	var result = Concat(this.levelsTree, {
		files: globs,
		dest: dest,
		mapCommentType: 'block'
	})
	// TODO css minify
	return result
}

Tree.prototype.cleanup = function() {}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
