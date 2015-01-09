var path = require('path')
var _ = require('underscore')
var sieve = require('broccoli-file-sieve')
var mergeTrees = require('broccoli-merge-trees')

var scss = require('../plugins/scss')
var makeDepsGlobs = require('../makeDepsGlobs')

var SUFFIXES = ['scss', 'ie8.scss', 'ie9.scss', 'mix.scss']

var Tree = function(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options 
}

Tree.prototype.description = 'Scss tech'

Tree.prototype.read = function(readTree) {
	var mixGlobs = makeDepsGlobs(this.deps, ['mix.scss'], true)
	var filesGlobs = makeDepsGlobs(this.deps, _.without(SUFFIXES, 'mix.scss'), true)

	//move mixins to the top level
	var mixTree = sieve(this.levelsTree, {
		files: mixGlobs,
		changeFilePath: path.basename
	})
	var newTree = mergeTrees([this.levelsTree, mixTree])

	return readTree(scss(newTree, {
		files: filesGlobs,
		sassOptions: {
			imagePath: '../images'
		}
	}))
}

Tree.prototype.cleanup = function() {}

module.exports = {
	Tree: Tree,
	suffixes: SUFFIXES,
	nextTechs: ['css']
}
