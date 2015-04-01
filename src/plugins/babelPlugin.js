var _ = require('underscore')
var chalk = require('chalk')
var Filter = require('broccoli-glob-filter')
var transpiler = require('babel')

var Tree = function(inputTree, options) {
	if (!(this instanceof Tree)) return new Tree(inputTree, options)
	if (!options) options = {}
	if (options.files === undefined) options.files = ['**/*.es6']
	if (options.targetExtension === undefined) options.targetExtension = 'js'
	Filter.apply(this, arguments)
}

Tree.prototype = Object.create(Filter.prototype)
Tree.prototype.description = 'Babel'

Tree.prototype.processFileContent = function(content, relPath) {
	var options = _.extend({}, this.options.es6to5, {
		filename: relPath,
		sourceMapName: relPath,
		sourceFileName: relPath
	})
	try {
		return transpiler.transform(content, options).code
	} catch(error) {
		var prettyError = new Error(
			'Babel can\'t compile file \n' +
			// 'broccoli serve' diplays errors in browser, so console colors must be removed
			chalk.stripColor(error.message)
		)
		throw(prettyError)
	}
}

module.exports = Tree
