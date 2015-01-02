var _ = require('underscore')
var path = require('path')
var mergeTrees = require('broccoli-merge-trees')

var TechBuilder = require('../techBuilder')
var Concat = require('../plugins/concat')

var SUFFIXES = ['css', 'ie8.css', 'ie9.css']

function Tree(levelsTree, deps, options) {
	options.suffixes = SUFFIXES
	TechBuilder.apply(this, arguments)
}

Tree.prototype = Object.create(TechBuilder.prototype)
Tree.prototype.description = 'Css tech'

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
	var dest = path.join('styles', moduleName + '.' + suffix)
	var result = Concat(this.levelsTree, {
		files: globs,
		dest: dest
	})
	//css minify?
	return result
}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
