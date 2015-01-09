var _ = require('underscore')
var path = require('path')
var glob = require('glob')
		
/**
 * Glob pattern for filenames without '.' in the name, except version number
 * at the end. For example, 'jquery-1.8.1'.
 * It allows techs to have '.' in suffixes, for example, '*.sprite.png', '*.ie8.css'.
 */
var SINGLE_EXTENSION_PATTERN = '*([^.])*(.[0-9])'

//TODO change this function with multiple-glob or dirmatch
var globArraySync = function(patterns, options) {
	if (options === undefined) options = {}
	var result = []
	_.each(patterns, function(pattern) {
		var exclusion = pattern.indexOf('!') === 0
		if (exclusion) pattern = pattern.slice(1)
		var matches = glob.sync(pattern, options)
		if (exclusion) {
			result = _.difference(result, matches)
		} else {
			result = _.union(result, matches)
		}
	})
	return result
}

function findFiles(dir, pattern) {
	var excludeSubdirs = [] //this.config.excludeSubdirs TODO
	var excludePatterns = _.map(excludeSubdirs, function(dir) {
		return '!' + path.join(dir, '*', dir, '**') 
	})
	var includePatterns = [path.join(dir, '**', pattern)]
	var patterns = [].concat(includePatterns, excludePatterns)
	return globArraySync(patterns)
	//TODO glob must have nodir: true, dir may have name 'some.js'
}

/** Finds files with tech suffix in level dir. */
var findTechFiles = function(dir, suffix) {
	var pattern = SINGLE_EXTENSION_PATTERN + '.' + suffix
	return findFiles(dir, pattern)
}

module.exports = findTechFiles
