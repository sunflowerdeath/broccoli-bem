var path = require('path')
var _ = require('underscore')
var dirmatch = require('dirmatch')
var sieve = require('broccoli-file-sieve')
var renderHandlebars = require('broccoli-render-handlebars')

var makeDepsGlobs = require('../makeDepsGlobs')

var SUFFIXES = ['hbs', 'part.hbs']

var Tree = function(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options 
}

Tree.prototype.description = 'Page tech'

Tree.prototype.read = function(readTree) {
	return readTree(this.levelsTree).then(function(srcDir) {
		var renderTree = renderHandlebars(this.levelsTree, {
			files: ['**/' + this.options.blockName + '.hbs'],
			partials: makeDepsGlobs(this.deps, 'part.hbs', true),
			makePartialName: function(file) { return path.basename(file, '.hbs') },
			context: this.makeRenderCtx(srcDir)
		})
		var deployTree = sieve(renderTree, {
			files: ['**/*.html'],
			destDir: 'html',
			changeFilePath: path.basename,
		})
		return readTree(deployTree)
	}.bind(this))
}

Tree.prototype.makeRenderCtx = function(srcDir) {
	var deployPath = this.options.deployPath
	var suffixes = ['js', 'ie8.js', 'ie9.js', 'css', 'ie8.css', 'ie9.css']
	var modules = _.keys(this.deps)
	var files = {}
	_.each(suffixes, function(suffix) {
		var globs = _.map(modules, function(module) {
			return path.join('**', module + '.' + suffix)
		})
		files[suffix] = _.map(dirmatch(srcDir, globs), function(file) {
			return path.join(deployPath, file) //TODO hashes
		})
	})
	return {files: files}
}

Tree.prototype.cleanup = function() {}

module.exports = {
	Tree: Tree,
	suffixes: SUFFIXES,
	prevTechs: ['css', 'js']
}
