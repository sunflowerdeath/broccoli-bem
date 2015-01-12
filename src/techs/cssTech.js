var _ = require('underscore')
var path = require('path')
var mergeTrees = require('broccoli-merge-trees')
var cleanCss = require('broccoli-clean-css')

var makeDepsGlobs = require('../makeDepsGlobs')
var SourcemapConcat = require('../plugins/sourcemapConcatPlugin')
var Concat = require('../plugins/concatPlugin')

var SUFFIXES = ['css', 'ie8.css', 'ie9.css']

function Tree(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options
}

Tree.prototype.description = 'Css tech'

Tree.prototype.read = function(readTree) {
	if (!this.cachedTree) this.cachedTree = this.createTree()
	return readTree(this.cachedTree)
}

Tree.prototype.createTree = function(depsGlobs) {
	var _this = this
	var depsGlobs = makeDepsGlobs(this.deps, SUFFIXES)
	var trees = _.flatten(_.map(depsGlobs, function(suffixGlobs, suffix) {
		return _.map(suffixGlobs, function(moduleGlobs, moduleName) {
			return _this.createConcat(moduleGlobs, moduleName, suffix)
		})
	}))
	var result = mergeTrees(trees)
	if (!this.options.debug) result = cleanCss(result)
	return result
}

Tree.prototype.createConcat = function(globs, moduleName, suffix) {
	var dest = path.join('styles', moduleName + '.' + suffix)
	if (this.options.debug) {
		return SourcemapConcat(this.levelsTree, {
			files: globs,
			dest: dest,
			mapCommentType: 'block'
		})
	} else {
		return Concat(this.levelsTree, {files: globs, dest: dest})
	}
}

Tree.prototype.cleanup = function() {}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
