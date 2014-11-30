var _ = require('underscore')
var fs = require('fs')
var path = require('path')
var Writer = require('broccoli-writer')
var uglify = require('uglify-js')

var findDepsFiles = require('../findDepsFiles')

var SUFFIXES = ['js', 'ie8.js', 'ie9.js']

function Tree(levelsTree, deps, options) {
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options
}

Tree.prototype = Object.create(Writer.prototype)
Tree.prototype.constructor = Tree

Tree.prototype.write = function(readTree, destDir) {
	var self = this
	return readTree(this.levelsTree).then(function(levelsDir) {
		var scriptsDir = path.join(destDir, '/scripts')
		fs.mkdir(scriptsDir)
		_.map(SUFFIXES, function(suffix) {
			var depsFiles = findDepsFiles(levelsDir, self.deps, suffix)
			return _.map(depsFiles, function(files, moduleName) {
				var absFiles = _.map(files, function(file) {
					return path.join(levelsDir, file)
				})
				var file = moduleName + '.' + suffix
				var mapFile = moduleName + '.map.' + suffix
				var options = self.options.debug ? {
					compress: false,
					sourceMapIncludeSources: true,
					outSourceMap: mapFile,
					global_defs: { //jshint ignore:line
						DEBUG: true
					}
				} : {}
				var result = uglify.minify(absFiles, options)
				fs.writeFileSync(path.join(scriptsDir, file), result.code)
				if (self.options.debug) {
					fs.writeFileSync(path.join(scriptsDir, mapFile), result.map)
				}
				if (self.options.verbose) {
					console.log('[broccoli-bem-js] Created file "' + file + '"')
				}
			})
		})
	})
}

Tree.prototype.cleanup = function() {}

module.exports = {
	suffixes: SUFFIXES,
	Tree: Tree
}
