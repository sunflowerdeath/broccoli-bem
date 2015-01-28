var autoprefixer = require('broccoli-autoprefixer')

function Tree(inputTree, deps, options) {
	this.inputTree = inputTree
	this.options = options
}

Tree.prototype.description = 'Autoprefixer tech'

Tree.prototype.read = function(readTree) {
	if (!this.cachedTree) {
		this.cachedTree = autoprefixer(this.inputTree, {
			browsers: ['ie >= 8', 'ios >= 7', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
			map: this.options.debug ? {inline: false} : false
		})
	}
	return readTree(this.cachedTree)
}

Tree.prototype.cleanup = function() {}

module.exports = {
	postprocessor: true,
	prevTechs: ['css'],
	Tree: Tree
}
