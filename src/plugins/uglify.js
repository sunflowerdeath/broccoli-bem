var fs = require('fs')
var path = require('path')
var uglify = require('uglify-js')
var mkdirp = require('mkdirp')
var CachingWriter = require('broccoli-glob-caching-writer')

var Uglify = function(inputTrees, options) {
	if (!(this instanceof Uglify)) return new Uglify(inputTrees, options)
	if (options.dest === undefined) {
		throw new Error('[broccoli-uglify] Option "dest" is required')
	}
  CachingWriter.apply(this, arguments)
}

Uglify.prototype = Object.create(CachingWriter.prototype)
Uglify.prototype.description = 'Uglify'

Uglify.prototype.updateCache = function(srcDirs, destDir, files) {
	if (!files.length) return
	var result = uglify.minify(files)
	var dest = path.join(destDir, this.options.dest)
	mkdirp.sync(path.dirname(dest))
	fs.writeFileSync(dest, result.code)
}

module.exports = Uglify
