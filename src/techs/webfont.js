var path = require('path')
var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')
var webfont = require('broccoli-webfont')

var findDepsFiles = require('../findDepsFiles')

var SUFFIXES = ['icon.svg']

function Tree(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options
}

Tree.prototype.read = function(readTree) {
	var _this = this
	if (!this.cachedResult) {
		this.cachedResult = readTree(this.levelsTree).then(function(levelsDir) {
			var depsFiles = findDepsFiles(levelsDir, _this.deps, SUFFIXES[0])
			var trees = _.compact(_.map(depsFiles, function(files, moduleName) {
				if (!files.length) return
				return webfont(levelsDir, {
					files: files,
					fontName: moduleName,
					dest: 'fonts',
					cssDest: path.join('fonts', moduleName + '.mix.scss'),
					cssTemplateType: 'scss',
					cssFontsPath: path.join(_this.options.deployPath, 'images'),
					rename: function(file) {
						return path.basename(file, '.icon.svg')
					}
				})
			}))
			var mergedTree = mergeTrees(_.flatten(trees))
			return readTree(mergedTree)
		})
	}
	return this.cachedResult
}

Tree.prototype.cleanup = function() {}

module.exports = {
	preprocessor: true,
	nextTechs: ['scss', 'images'],
	suffixes: SUFFIXES,
	Tree: Tree
}
