var path = require('path')
var CachingWriter = require('broccoli-glob-caching-writer')
var SourcemapConcat = require('fast-sourcemap-concat')

var Concat = function(inputTrees, options) {
	if (!(this instanceof Concat)) return new Concat(inputTrees, options)
	if (options.dest === undefined) {
		throw new Error('[broccoli-concat] Option "dest" is required')
	}
	if (options.separator === undefined) options.separator = '\n'
	if (options.mapDest === undefined) options.mapDest = options.dest + '.map'
	if (options.mapUrl === undefined) options.mapUrl = path.basename(options.mapDest)
  CachingWriter.apply(this, arguments)
}

Concat.prototype = Object.create(CachingWriter.prototype)
Concat.prototype.description = 'Concat'

Concat.prototype.updateCache = function(srcDirs, destDir, files) {
	var sourcemap = new SourcemapConcat({
		outputFile: path.join(this.destDir, this.options.dest),
		mapFile: path.join(this.destDir, this.options.mapDest),
		mapURL: this.options.mapUrl
	})
	if (this.options.header) sourcemap.addSpace(this.options.header)
	files.forEach(function(file) {
		sourcemap.addFile(file)
		sourcemap.addSpace(this.options.separator)
	}, this)
	if (this.options.footer) sourcemap.addSpace(this.options.footer)
	return sourcemap.end()
}

module.exports = Concat
