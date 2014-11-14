var _ = require('underscore')
var fs = require('fs')
var path = require('path')

var findTechFiles = require('./findTechFiles')
var matchDepsWithFiles = require('./matchDepsWithFiles')

var getLevelsDirs = function(levelsDir) {
	var dirs = fs.readdirSync(levelsDir).sort()
	return _.map(dirs, function(dir) { return path.join(levelsDir, dir) })
}

/**
 * @typedef FileList
 * Object with list of files for each build module.
 * @type {Object.<string, array.<string>>}
 */

/**
 * Finds tech files matching deps in levels tree.
 * @param {Tree} levelsDir - Directory of levelsTree.
 * @param {Deps} deps - Bem deps object.
 * @param {string} suffix - Suffix of tech files.
 * @return {Promise} Promise resolving to FileList. 
 */
var makeFileList = function(levelsDir, deps, suffix) {
	var levelsDirs = getLevelsDirs(levelsDir)
	var files = _.flatten(_.map(levelsDirs, function(levelDir) {
		return findTechFiles(levelDir, suffix)
	}))
	return matchDepsWithFiles(deps, files)
}

module.exports = makeFileList