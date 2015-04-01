var path = require('path')
var es6to5 = require('../plugins/babelPlugin')
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

var changeOptions = function(options) {
	options.levels.unshift(path.resolve(__dirname, '../../vendor/babel/babel-browser-polyfill'))
	return options
}

var changeDecls = function(reader, options) {
	reader.changeDecl(options.blockName, function(origDecl) {
		origDecl.blocks.unshift({name: 'babel-browser-polyfill'})
		return origDecl
	})
}

module.exports = {
	Tree: Tree,
	suffixes: SUFFIXES,
	nextTechs: ['js'],
	preprocessor: true,
	changeOptions: changeOptions,
	changeDecls: changeDecls
}
