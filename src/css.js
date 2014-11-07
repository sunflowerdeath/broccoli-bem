var _ = require('underscore')
var pickFiles = require('broccoli-static-compiler')
var mergeTrees = require('broccoli-merge-trees')
var concat = require('broccoli-concat')

var LevelsReader = require('./LevelsReader')
var makeFileList = require('./makeFileList')

function Picker(deps, config) {
	if (!(this instanceof Picker)) return new Picker(deps, config)
	console.log('create picker')
	this.config = config
	this.deps = deps
}

Picker.prototype.read = function(readTree) {
	console.log('read picker')
	return readTree(LevelsReader(this.config.levels, this.deps, '.css'))
}

Picker.prototype.cleanup = function() {}


function Builder(inputTree, deps, config) {
  if (!(this instanceof Builder)) return new Builder(inputTree, deps, config)
	console.log('create builder')
	this.inputTree = inputTree
	this.deps = deps
	this.config = config
}

Builder.prototype.read = function(readTree, destDir) {
	console.log('read builder')
	return makeFileList(readTree, this.inputTree, this.deps, '.css')
		.then(function(fileList) {
			console.log('filelist', fileList)
			var tree = mergeTrees(_.map(fileList, function(files, moduleName) {
				return concat(this.inputTree, {
					inputFiles: files,
					outputFile: '/styles/' + moduleName + '.css',
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