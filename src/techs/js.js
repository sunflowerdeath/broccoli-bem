var _ = require('underscore')
var path = require('path')
var mergeTrees = require('broccoli-merge-trees')

var TechBuilder = require('../techBuilder')
var Concat = require('../plugins/concat')
var Uglify = require('../plugins/uglify')

var SUFFIXES = ['js', 'ie8.js', 'ie9.js']

function Tree(levelsTree, deps, options) {
	options.suffixes = SUFFIXES
	TechBuilder.apply(this, arguments)
}

Tree.prototype = Object.create(TechBuilder.prototype)
Tree.prototype.description = 'Js tech'

Tree.prototype.build = function(readTree, depsGlobs) {
	if (!this.cachedTree) this.cachedTree = this.createTree(depsGlobs)
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
	var dest = path.join('scripts', moduleName + '.' + suffix)
	var result
	if (this.options.debug) {
		result = Concat(this.levelsTree, {
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

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
