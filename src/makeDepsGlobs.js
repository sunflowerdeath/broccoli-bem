var _ = require('underscore')

var makeDepsGlobs = function(deps, suffix) {
	return _.object(_.map(deps, function(moduleDeps, moduleName) { 
		return [
			moduleName,
			_.map(moduleDeps, function(dep) {
				return '**/' + dep + '.' + suffix
			})
		]
	}))
}

module.exports = makeDepsGlobs
