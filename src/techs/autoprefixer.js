var autoprefixer = require('broccoli-autoprefixer')

function Tree(inputTree) {
	this.inputTree = inputTree
}

Tree.prototype.description = 'Autoprefixer tech'

Tree.prototype.read = function(readTree) {
	return readTree(autoprefixer(this.inputTree, {
		browsers: ['ie >= 8', 'ios >= 7', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
	}))
}

Tree.prototype.cleanup = function() {}

module.exports = {
	postprocessor: true,
	prevTechs: ['css'],
	Tree: Tree
}
