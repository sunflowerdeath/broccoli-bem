var path = require('path')
var _ = require('underscore')
var Q = require('q')
var handlebars = require('handlebars')
var Filter = require('broccoli-glob-filter')

var Tree = function(inputTree, options) {
	if (!(this instanceof Scss)) return new Scss(inputTree, options)
	if (!options) options = {}
	if (options.files === undefined) options.files = ['**/*.hbs']
	if (options.targetExtension === undefined) options.targetExtension = 'html'
  Filter.apply(this, arguments)
}

Tree.prototype = Object.create(Filter.prototype)
Tree.prototype.description = 'Handlebars'

Tree.prototype.read = function() {
	var _this = this
	return this.readTree(this.inputTree, function(srcDir) {
		_this.loadPartials(srcDir)
		return Filter.prototype.read.apply(_this, arguments)
	})
}

Tree.prototype.loadPartials = function(srcDir) {
	var partials = this.findPartials() //find partials
	var partialsHash = this.hashPartials() //hash partials
	if (this.cachedPartialsHash !== partialsHash) {
		this.cachedPartialsHash = partialsHash
		this.cachedPartials = this.readPartials //read and compile partials
		this.invalidateCache()
	}
}

Tree.prototype.processFileContent = function(content, relPath, srcDir) {
	//compile template and render

	//files {array.<string>}
		//default - "**/*.hbs"
	//helpers {object}
	//partialsPath {string}
	//context {object|function(filepath:string) -> object}
	//dest {string} - directory
	//changeFileName {function(string) -> string}
		//default - replace ".hbs" or ".handlebars" with html
	//handlebars - Handlebars instance
}

module.exports = Tree
