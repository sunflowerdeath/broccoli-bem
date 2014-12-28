var _ = require('underscore')

function getDeclsData(declName, reader) {
	var data = {
		decls: {},
		modules: [],
		deferredModules: []
	}

	reader.traverse(declName, function(name, decl) {
		data.decls[name] = decl
		if (decl.module) {
			var arr = decl.deferred ? data.deferredModules : data.modules
			if (arr.indexOf(name) == -1) arr.push(name)
		}
	})

	return data
}

function makeDeclDeps(declName, decls, deferred, deferredModules) {
	var deps = []
	var decl = decls[declName]

	for (var i in decl.blocks) {
		var block = decl.blocks[i]

		//deferred blocks are included only to deferred modules
		if (!deferred && _.contains(deferredModules, block.name)) continue
		deps = deps.concat(makeDeclDeps(block.name, decls, deferred, deferredModules))
		deps = deps.concat(makeItemsDeps(block.items, decls, deferred, deferredModules))
	}

	deps.push(declName)
	deps = deps.concat(makeItemsDeps(decl.items, decls, deferred, deferredModules))

	return _.uniq(deps)
}

function makeItemsDeps(items, decls, deferred, deferredModules) {
	var deps = []
	for (var i in items) {
		var item = items[i]
		deps = deps.concat(makeDeclDeps(item, decls, deferred, deferredModules))
		deps.push(item)
	}
	return deps
}

/**
 * @param declName {string}
 * @param reader {DeclReader}
 * @return List of deps of each module.
 */
function makeDeps(declName, reader) {
	var declsData = getDeclsData(declName, reader)
	var modules = declsData.modules
	var deferredModules = declsData.deferredModules
	var decls = declsData.decls
	var deps = {}

	modules = _.union(modules, [declName], deferredModules)

	for (var i in modules) {
		var moduleName = modules[i]
		var deferred = deferredModules.indexOf(moduleName) != -1
		var moduleDeps = makeDeclDeps(moduleName, decls, deferred, deferredModules)
		//deps of module are its deps without deps of prev modules
		deps[moduleName] = _.difference(moduleDeps, _.flatten(_.values(deps)))
	}

	return deps
}

module.exports = makeDeps
