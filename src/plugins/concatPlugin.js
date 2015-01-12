var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var CachingWriter = require('broccoli-glob-caching-writer')

var Concat = function(inputTree, options) {
	if (!(this instanceof Concat)) return new Concat(inputTree, options)
	if (!options) options = {}
	if (options.dest === undefined) throw new Error('Option "dest" is required')
	if (options.separator === undefined) options.separator = '\n'
	CachingWriter.apply(this, arguments)
}

Concat.prototype = Object.create(CachingWriter.prototype)
Concat.prototype.description = 'Concat'

Concat.prototype.updateCache = function(srcDir, destDir, files) {
	if (!files.length) return
	var results = []
	if (this.options.header) results.push(this.options.header, this.options.separator)
	files.forEach(function(file) {
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
