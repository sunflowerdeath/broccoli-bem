var path = require('path')
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
	var globs = makeDepsGlobs(this.deps, SUFFIXES, true)
	return readTree(sieve(this.levelsTree, {
		files: globs,
		changeFilePath: function(file) {
			return path.join('images', path.basename(file))
		}
	}))
}

Tree.prototype.cleanup = function() {}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
