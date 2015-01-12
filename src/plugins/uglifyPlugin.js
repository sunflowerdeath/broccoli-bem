var fs = require('fs')
var path = require('path')
var uglify = require('uglify-js')
var mkdirp = require('mkdirp')
var _ = require('underscore')
var CachingWriter = require('broccoli-glob-caching-writer')

var Uglify = function(inputTrees, options) {
	if (!(this instanceof Uglify)) return new Uglify(inputTrees, options)
	if (options.dest === undefined) throw new Error('Option "dest" is required')
	CachingWriter.apply(this, arguments)
}

Uglify.prototype = Object.create(CachingWriter.prototype)
Uglify.prototype.description = 'Uglify'

Uglify.prototype.updateCache = function(srcDir, destDir, files) {
	if (!files.length) return
	var absFiles = _.map(files, function(file) { return path.join(srcDir, file) })
	var result = uglify.minify(absFiles)
	var dest = path.join(destDir, this.options.dest)
	mkdirp.sync(path.dirname(dest))
	fs.writeFileSync(dest, result.code)
}

module.exports = Uglify
