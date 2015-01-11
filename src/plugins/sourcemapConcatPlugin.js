var path = require('path')
var CachingWriter = require('broccoli-glob-caching-writer')
var SourcemapConcat = require('fast-sourcemap-concat')

var Concat = function(inputTree, options) {
	if (!(this instanceof Concat)) return new Concat(inputTree, options)
	if (!options) options = {}
	if (options.dest === undefined) {
		throw new Error('[broccoli-concat] Option "dest" is required')
	}
	if (options.separator === undefined) options.separator = '\n'
	if (options.mapDest === undefined) options.mapDest = options.dest + '.map'
	if (options.mapUrl === undefined) options.mapUrl = path.basename(options.mapDest)
  CachingWriter.apply(this, arguments)
}

Concat.prototype = Object.create(CachingWriter.prototype)
Concat.prototype.description = 'SourcemapConcat'

Concat.prototype.updateCache = function(srcDir, destDir, files) {
	if (!files.length) return
	var sourcemap = new SourcemapConcat({
		outputFile: path.join(destDir, this.options.dest),
		mapFile: path.join(destDir, this.options.mapDest),
		mapURL: this.options.mapUrl,
		mapCommentType: this.options.mapCommentType,
		baseDir: srcDir
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
