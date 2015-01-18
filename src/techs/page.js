var path = require('path')
var _ = require('underscore')
var sieve = require('broccoli-file-sieve')
var mergeTrees = require('broccoli-merge-trees')

var scss = require('../plugins/scssPlugin')
var makeDepsGlobs = require('../makeDepsGlobs')

var SUFFIXES = ['scss', 'ie8.scss', 'ie9.scss', 'mix.scss']

var Tree = function(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options 
}

Tree.prototype.description = 'Scss tech'

Tree.prototype.read = function(readTree) {
	//partials may have .part.hbs ext
	//and separated to 'partialspath'?
	
	//takes file moduleName and {techOptions?.handlebars.pages} .hbs
	//get/find templates || make template globs

	//make files object
	//take all css and js files and separate by extensions

	//pass object to template
	//or to handlebars plugin
}

Tree.prototype.cleanup = function() {}

module.exports = {
	Tree: Tree,
	suffixes: SUFFIXES,
	prevTechs: ['css', 'js']
}
