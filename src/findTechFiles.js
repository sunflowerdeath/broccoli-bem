var _ = require('underscore')
var path = require('path')
var glob = require('glob')
		
/** TODO translate
 * Шаблон для поиска файлов без '.' внутри имени, кроме номера версии идущего
 * в конце '.', например, 'jquery-1.8.1'.
 * Используется для работе с технологиями, которые имеют '.' в суффиксе,
 * например, '*.sprite.png' и '*.ie8.css'.
 */
var SINGLE_EXTENSION_PATTERN = '*([^.])*(.[0-9])'

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
				return '!' + path.join(levelDir, '*', dir, '**') 
			}),
			includePatterns = [path.join(dir, '**', pattern)],
			patterns = [].concat(includePatterns, excludePatterns)
	return globArraySync(patterns)
}

/** Finds files with tech suffix in level dir. */
var findTechFiles = function(dir, suffix) {
	var pattern = SINGLE_EXTENSION_PATTERN + suffix
	return findFiles(dir, pattern)
}

module.exports = findTechFiles