var path = require('path')
var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')
var webfont = require('broccoli-webfont')

var makeDepsGlobs = require('../makeDepsGlobs')
var sourcemapConcat = require('../plugins/sourcemapConcatPlugin')

var SUFFIXES = ['icon.svg']

function Tree(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options
}

Tree.prototype.description = 'Webfont tech'

Tree.prototype.read = function(readTree) {
	if (!this.cachedTree) this.cachedTree = this.makeTree()
	return readTree(this.cachedTree)
}

Tree.prototype.makeTree = function() {
	var depsGlobs = makeDepsGlobs(this.deps, SUFFIXES)['icon.svg']

	var trees = _.map(depsGlobs, function(moduleGlobs, moduleName) {
		return webfont(this.levelsTree, {
			files: moduleGlobs,
			fontName: moduleName,
			dest: 'fonts',
			cssDest: path.join('fonts', moduleName + '.webfont.scss'),
			cssTemplate: webfont.templates.scss,
			cssFontsPath: '../images',
			rename: function(file) {
				return path.basename(file, '.icon.svg')
			}
		})
	}, this)

	var mergedTree = mergeTrees(trees)
	var mix = sourcemapConcat(mergedTree, {
		files: ['fonts/*.webfont.scss'],
		dest: 'fonts/webfont.mix.scss',
		enabled: false
	})
	return mergeTrees([mergedTree, mix])
}

Tree.prototype.cleanup = function() {}

module.exports = {
	preprocessor: true,
	nextTechs: ['scss', 'img'],
	suffixes: SUFFIXES,
	Tree: Tree,
	changeDeps: function(deps, options) {
		deps[options.blockName].push('webfont')
		return deps
	}
}
