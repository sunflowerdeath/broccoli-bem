var _ = require('underscore')
var path = require('path')
var mergeTrees = require('broccoli-merge-trees')

var makeDepsGlobs = require('../makeDepsGlobs')
var sourcemapConcat = require('../plugins/sourcemapConcatPlugin')
var uglify = require('broccoli-uglify-js')

var SUFFIXES = ['js', 'ie8.js', 'ie9.js']

function Tree(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options
}

Tree.prototype.description = 'Js tech'

Tree.prototype.read = function(readTree) {
	if (!this.cachedTree) this.cachedTree = this.createTree()
	return readTree(this.cachedTree)
}

Tree.prototype.createTree = function() {
	var _this = this
	var depsGlobs = makeDepsGlobs(this.deps, SUFFIXES)
	var trees = _.flatten(_.map(depsGlobs, function(suffixGlobs, suffix) {
		return _.map(suffixGlobs, function(bundleGlobs, bundleName) {
			return _this.createConcat(bundleGlobs, bundleName, suffix)
		})
	}))
	var result = mergeTrees(trees)
	if (!this.options.debug) result = uglify(result)
	return result
}

Tree.prototype.createConcat = function(globs, bundleName, suffix) {
	var dest = path.join('scripts', bundleName + '.' + suffix)
	var concatOptions = {
		files: globs,
		dest: dest,
		separator: ';\n',
		mapEnabled: false
	}
	if (this.options.debug) {
		concatOptions.header = 'var DEBUG = true;'
		concatOptions.mapEnabled = true
	}
	return sourcemapConcat(this.levelsTree, concatOptions)
}

Tree.prototype.cleanup = function() {}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
