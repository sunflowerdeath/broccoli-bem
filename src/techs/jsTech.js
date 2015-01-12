var _ = require('underscore')
var path = require('path')
var mergeTrees = require('broccoli-merge-trees')

var makeDepsGlobs = require('../makeDepsGlobs')
var SourcemapConcat = require('../plugins/sourcemapConcatPlugin')
var Uglify = require('../plugins/uglifyPlugin')

var SUFFIXES = ['js', 'ie8.js', 'ie9.js']

function Tree(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options
}

Tree.prototype.description = 'Js tech'

Tree.prototype.read = function(readTree, depsGlobs) {
	if (!this.cachedTree) this.cachedTree = this.createTree(depsGlobs)
	return readTree(this.cachedTree)
}

Tree.prototype.createTree = function() {
	var _this = this
	var depsGlobs = makeDepsGlobs(this.deps, SUFFIXES)
	var trees = _.flatten(_.map(depsGlobs, function(suffixGlobs, suffix) {
		return _.map(suffixGlobs, function(moduleGlobs, moduleName) {
			return _this.createConcat(moduleGlobs, moduleName, suffix)
		})
	}))
	return mergeTrees(trees)
}

Tree.prototype.createConcat = function(globs, moduleName, suffix) {
	var dest = path.join('scripts', moduleName + '.' + suffix)
	var result
	if (this.options.debug) {
		result = SourcemapConcat(this.levelsTree, {
			files: globs,
			dest: dest,
			header: 'var DEBUG = true;',
			separator: ';\n'
		})
	} else {
		result = Uglify(this.levelsTree, {
			files: globs,
			dest: dest
		})
	}
	return result
}

Tree.prototype.cleanup = function() {}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
