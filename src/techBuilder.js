var _ = require('underscore')

var makeDepsGlobs = require('./makeDepsGlobs')

function TechBuilder(levelsTree, deps, options) {
	if (!Array.isArray(options.suffixes)) {
		throw new Error('Option "suffixes" must be an array')
	}
	this.levelsTree = levelsTree
	this.deps = deps
	this.options = options
}

TechBuilder.prototype.read = function(readTree) {
	var depsGlobs = _.object(_.map(this.options.suffixes, function(suffix) {
		return [suffix, makeDepsGlobs(this.deps, suffix)]
	}, this))
	return this.build(readTree, depsGlobs)
}

TechBuilder.prototype.build = function(/* readTree, depsGlobs, levelsDir */) {
	throw new Error('You must implement method "build"')
}

TechBuilder.prototype.cleanup = function(){}

module.exports = TechBuilder
