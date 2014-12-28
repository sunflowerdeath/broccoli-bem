var _ = require('underscore')
var Funnel = require('broccoli-funnel')

var findDepsFiles = require('../findDepsFiles')

var SUFFIXES = [
	'png', 'gif', 'jpg', 'jpeg', 'svg',
	'woff', 'ttf', 'otf', 'eot'
]

function Tree(levelsTree, deps) {
	this.levelsTree = levelsTree
	this.deps = deps
}

Tree.prototype.read = function(readTree) {
	var self = this
	return readTree(this.levelsTree).then(function(levelsDir) {
		var files = _.flatten(_.map(SUFFIXES, function(suffix) {
			var depsFiles = findDepsFiles(levelsDir, self.deps, suffix)
			return _.flatten(_.values(depsFiles))
		}))

		return readTree(new Funnel(levelsDir, {
			files: files,
			getDestinationPath: function() { return '' }
		}))
	})
}

Tree.prototype.cleanup = function() {}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
