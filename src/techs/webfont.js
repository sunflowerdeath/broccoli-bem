var path = require('path')
var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')
var webfont = require('broccoli-webfont')

var TechBuilder = require('../techBuilder')

var SUFFIXES = ['icon.svg']

function Tree(levelsTree, deps, options) {
	options.suffixes = SUFFIXES
	TechBuilder.apply(this, arguments)
}

Tree.prototype = Object.create(TechBuilder.prototype)
Tree.prototype.description = 'Webfont tech'

Tree.prototype.build = function(depsGlobs, levelsDir) {
	var _this = this
	var trees = _.map(depsGlobs['icon.svg'], function(moduleGlobs, moduleName) {
		return webfont(levelsDir, {
			files: moduleGlobs,
			fontName: moduleName,
			dest: 'fonts',
			cssDest: path.join('fonts', moduleName + '.mix.scss'),
			cssTemplateType: 'scss',
			cssFontsPath: path.join(_this.options.deployPath, 'images'),
			rename: function(file) {
				return path.basename(file, '.icon.svg')
			}
		})
	})
	return mergeTrees(trees)
}

module.exports = {
	preprocessor: true,
	nextTechs: ['scss', 'images'],
	suffixes: SUFFIXES,
	Tree: Tree
}
