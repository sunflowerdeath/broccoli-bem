var path = require('path')
var _ = require('underscore')
var Q = require('q')
var sass = require('node-sass')
var Filter = require('broccoli-glob-filter')

var Scss = function(inputTree, options) {
	if (!(this instanceof Scss)) return new Scss(inputTree, options)
	if (!options) options = {}
	if (options.targetExtension === undefined) options.targetExtension = 'css'
  Filter.apply(this, arguments)
}

Scss.prototype = Object.create(Filter.prototype)
Scss.prototype.description = 'Scss'

Scss.prototype.processFileContent = function(content, relPath, srcDir) {
	var deferred = Q.defer()
	var options = _.defaults({
		file: path.join(srcDir, relPath),
		data: content,
		success: function(result) {
			deferred.resolve(result.css)
		},
		error: function(error) {
			var prettyError = new Error(
				'[scss plugin] can\'t build scss\n' +
				'Message: ' + error.message + '\n' +
				'File: ' + path.relative(srcDir, error.file) + '\n' +
				'Line: ' + error.line + '\n' +
				'Column: ' + error.column + '\n'
			)
			deferred.reject(prettyError)
		}
	}, this.options.sassOptions)
	options.includePaths = options.includePaths || []
	options.includePaths.push(srcDir)
	sass.render(options)
	return deferred.promise
}

module.exports = Scss
