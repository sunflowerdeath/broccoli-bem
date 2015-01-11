var path = require('path')
var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')
var webfont = require('broccoli-webfont')

var makeDepsGlobs = require('../makeDepsGlobs')

var SUFFIXES = ['icon.svg']

function Tree(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options
}

Tree.prototype.description = 'Webfont tech'

Tree.prototype.read = function(readTree) {
	if (!this.cachedTree) {
		var depsGlobs = makeDepsGlobs(this.deps, SUFFIXES)
		this.cachedTree = this.makeTree(depsGlobs)
	}
	return readTree(this.cachedTree)
}

Tree.prototype.makeTree = function(depsGlobs) {
	var trees = _.map(depsGlobs['icon.svg'], function(moduleGlobs, moduleName) {
		return webfont(this.levelsTree, {
			files: moduleGlobs,
			fontName: moduleName,
			dest: 'fonts',
			cssDest: path.join('fonts', moduleName + '.mix.scss'),
			cssTemplateType: 'scss',
			cssFontsPath: '../images',
			rename: function(file) {
				return path.basename(file, '.icon.svg')
			}
		})
	}, this)
	return mergeTrees(trees)
}

module.exports = {
	preprocessor: true,
	nextTechs: ['scss', 'img'],
	suffixes: SUFFIXES,
	Tree: Tree
}
