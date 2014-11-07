var _ = require('underscore')
var pickFiles = require('broccoli-static-compiler')
var mergeTrees = require('broccoli-merge-trees')
var concat = require('broccoli-concat')
var path = require('path')

var LevelsReader = require('./LevelsReader')
var makeFileList = require('./makeFileList')

function Picker(deps, config) {
	if (!(this instanceof Picker)) return new Picker(deps, config)
	this.config = config
	this.deps = deps
}

Picker.prototype.read = function(readTree) {
	return readTree(LevelsReader(this.config.levels, this.deps, '.css'))
}

Picker.prototype.cleanup = function() {}


function Builder(levelsTree, deps, config) {
  if (!(this instanceof Builder)) return new Builder(levelsTree, deps, config)
	this.levelsTree = levelsTree
	this.deps = deps
	this.config = config
}

Builder.prototype.read = function(readTree, destDir) {
	var self = this
	return readTree(this.levelsTree)
		.then(function(levelsDir) {
			var fileList = makeFileList(levelsDir, self.deps, '.css')
			var tree = mergeTrees(_.map(fileList, function(files, moduleName) {
				var relFiles = _.map(files, function(file) {
					return path.relative(levelsDir, file)
				})
				return concat(self.levelsTree, {
					inputFiles: relFiles,
					outputFile: path.join('/styles', moduleName + '.css').replace(/\\/g, '/'),
					wrapInFunction: false
				})
			}))
			return readTree(tree)
		})
}

Builder.prototype.cleanup = function() {}

module.exports = {
	Picker: Picker,
	Builder: Builder
}