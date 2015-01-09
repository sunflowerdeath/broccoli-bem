var sieve = require('broccoli-file-sieve')

var makeDepsGlobs = require('../makeDepsGlobs')

var SUFFIXES = [
	'png', 'gif', 'jpg', 'jpeg', 'svg',
	'woff', 'ttf', 'otf', 'eot'
]

function Tree(levelsTree, deps) {
	this.levelsTree = levelsTree
	this.deps = deps
}

Tree.prototype.description = 'Img tech'

Tree.prototype.read = function(readTree) {
	var _this = this
	return readTree(this.levelsTree).then(function(levelsDir) {
		var globs = makeDepsGlobs(_this.deps, SUFFIXES, true)
		return readTree(sieve(levelsDir, {
			files: globs,
			changeFilePath: function() { return '' }
		}))
	})
}

Tree.prototype.cleanup = function() {}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
