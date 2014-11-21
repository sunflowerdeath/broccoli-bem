var _ = require('underscore')
var minimatch = require('minimatch')

var matchModuleDepsWithFiles = function(moduleDeps, files) {
	return _.flatten(_.map(moduleDeps, function(elem) {
		return minimatch.match(files, elem + '.*', {matchBase: true, nocase: true})
	}))
}
 
var matchDepsWithFiles = function(deps, files) {
	var fileList = {}
	for (var moduleName in deps) {
		var moduleDeps = deps[moduleName],
				moduleFileList = matchModuleDepsWithFiles(moduleDeps, files)
		if (moduleFileList.length) {
			fileList[moduleName] = moduleFileList
		}
	}
	return fileList
}

module.exports = matchDepsWithFiles
