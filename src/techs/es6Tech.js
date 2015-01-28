var path = require('path')
var es6to5 = require('../plugins/es6to5Plugin')
var makeDepsGlobs = require('../makeDepsGlobs')

var SUFFIXES = ['es6.js']

var Tree = function(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options 
}

Tree.prototype.description = 'Es6 tech'

Tree.prototype.read = function(readTree) {
	if (!this.cachedTree) {
		this.cachedTree = es6to5(this.levelsTree, {
			files: makeDepsGlobs(this.deps, SUFFIXES[0], true),
			changeFileName: function(file) {
				return path.join(path.dirname(file), path.basename(file, '.es6.js') + '.js')
			},
			es6to5: {
				sourceMap: this.options.debug ? 'inline' : false
			}
		})
	}
	return readTree(this.cachedTree)
}

Tree.prototype.cleanup = function() {}

module.exports = {
	Tree: Tree,
	suffixes: SUFFIXES,
	nextTechs: ['js'],
	preprocessor: true
}
