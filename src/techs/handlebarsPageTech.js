var crypto = require('crypto')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var dirmatch = require('dirmatch')
var sieve = require('broccoli-file-sieve')
var renderHandlebars = require('broccoli-render-handlebars')

var makeDepsGlobs = require('../makeDepsGlobs')

var SUFFIXES = ['page.hbs', 'part.page.hbs']

var Tree = function(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options 
}

Tree.prototype.description = 'Page tech'

Tree.prototype.read = function(readTree) {
	return readTree(this.levelsTree).then(function(srcDir) {
		var renderTree = renderHandlebars(this.levelsTree, {
			files: makeDepsGlobs(this.deps, 'page.hbs', true),
			partials: makeDepsGlobs(this.deps, 'part.page.hbs', true),
			makePartialName: function(file) { return path.basename(file, '.part.page.hbs') },
			changeFileName: function(file) { return path.basename(file, '.page.hbs') + '.html' },
			context: this.makeRenderCtx(srcDir),
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
	var _this = this
	var suffixes = ['js', 'css', 'ie8.css', 'ie9.css']
	var modules = _.keys(this.deps)
	var files = {}
	_.each(suffixes, function(suffix) {
		var globs = _.map(modules, function(module) {
			return path.join('**', module + '.' + suffix)
		})
		files[suffix] = _.map(dirmatch(srcDir, globs), function(file) {
			var url = path.join(_this.options.deployPath, file)
			url = url.replace(/\\/g, '/') // Fix for windows
			if (_this.options.debug) url += '?' + hashFile(path.join(srcDir, file))
			return url
		})
	})
	return {files: files}
}

Tree.prototype.cleanup = function() {}

var hashFile = function(file) {
	return crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex')
}

module.exports = {
	Tree: Tree,
	suffixes: SUFFIXES,
	prevTechs: ['css', 'js']
}
