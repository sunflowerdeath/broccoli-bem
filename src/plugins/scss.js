var path = require('path')
var _ = require('underscore')
var Q = require('q')
var sass = require('node-sass')
var Filter = require('broccoli-glob-filter')

var Scss = function(inputTrees, options) {
	if (!(this instanceof Scss)) return new Scss(inputTrees, options)
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
			var error = new Error('node-sass error\n' + 
				'message: ' + error.message + '\n' +
				'file: ' + error.file + '\n' +
				'line: ' + error.line + '\n' +
				'column: ' + error.column)
			deferred.reject(error)
		}
	}, this.options.sassOptions)
	options.includePaths = options.includePaths || []
	options.includePaths.push(srcDir)
	sass.render(options)
	return deferred.promise
}

module.exports = Scss
