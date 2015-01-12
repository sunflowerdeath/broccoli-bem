var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var mkdirp = require('mkdirp')
var CachingWriter = require('broccoli-glob-caching-writer')
var SourcemapConcat = require('fast-sourcemap-concat')

var Concat = function(inputTree, options) {
	if (!(this instanceof Concat)) return new Concat(inputTree, options)
	if (!options) options = {}
	if (options.dest === undefined) throw new Error('Option "dest" is required')
	options = _.defaults(options, {
		enabled: true,
		separator: '\n',
		mapDest: options.dest + '.map'
	})
	options.mapUrl = path.basename(options.mapDest)
	CachingWriter.apply(this, arguments)
}

Concat.prototype = Object.create(CachingWriter.prototype)
Concat.prototype.description = 'SourcemapConcat'

Concat.prototype.updateCache = function(srcDir, destDir, files) {
	if (!files.length) return
	if (this.options.enabled) this.concatWithMaps(srcDir, destDir, files)
	else this.simpleConcat(srcDir, destDir, files)
}

Concat.prototype.concatWithMaps = function(srcDir, destDir, files) {
	var sourcemap = new SourcemapConcat({
		outputFile: path.join(destDir, this.options.dest),
		mapFile: path.join(destDir, this.options.mapDest),
		mapURL: this.options.mapUrl,
		mapCommentType: this.options.mapCommentType,
		baseDir: srcDir
	})
	if (this.options.header) {
		sourcemap.addSpace(this.options.header)
		sourcemap.addSpace(this.options.separator)
	}
	files.forEach(function(file) {
		sourcemap.addFile(file)
		sourcemap.addSpace(this.options.separator)
	}, this)
	if (this.options.footer) {
		sourcemap.addSpace(this.options.separator)
		sourcemap.addSpace(this.options.footer)
	}
	return sourcemap.end()
}

Concat.prototype.simpleConcat = function(srcDir, destDir, files) {
	var results = []
	if (this.options.header) results.push(this.options.header, this.options.separator)
	_.each(files, function(file) {
		var filepath = path.join(srcDir, file)
		results.push(fs.readFileSync(filepath, 'utf-8'))
		results.push(this.options.separator)
	}, this)
	if (this.options.footer) results.push(this.options.separator, this.options.footer)
	var str = results.join('')
	var dest = path.join(destDir, this.options.dest)
	mkdirp.sync(path.dirname(dest))
	fs.writeFileSync(dest, str, 'utf-8')
}

module.exports = Concat
