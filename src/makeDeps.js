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
	var deps = [],
			decl = decls[declName]

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

function makeDeps(declName, reader) {
	var declsData = getDeclsData(declName, reader),
			modules = declsData.modules,
			deferredModules = declsData.deferredModules,
			decls = declsData.decls,
			deps = {}

	modules = _.union(modules, [declName], deferredModules)

	for (var i in modules) {
		var moduleName = modules[i],
				deferred = deferredModules.indexOf(moduleName) != -1,
				moduleDeps = makeDeclDeps(moduleName, decls, deferred, deferredModules)
		deps[moduleName] = _.difference(moduleDeps, _.flatten(_.values(deps)))
	}

	return deps
}

module.exports = makeDeps