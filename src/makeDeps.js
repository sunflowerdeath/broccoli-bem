var _ = require('underscore')

function getDeclsData(declName, reader) {
	var data = {
		decls: {},
		bundles: [],
		deferredBundles: []
	}

	reader.traverse(declName, function(name, decl) {
		data.decls[name] = decl
		if (decl.bundle) {
			var arr = decl.deferred ? data.deferredBundles : data.bundles
			if (arr.indexOf(name) == -1) arr.push(name)
		}
	})

	return data
}

function makeDeclDeps(declName, decls, deferred, deferredBundles) {
	var deps = []
	var decl = decls[declName]

	for (var i in decl.blocks) {
		var block = decl.blocks[i]

		// Deferred blocks are included only to deferred bundles
		if (!deferred && _.contains(deferredBundles, block.name)) continue
		deps = deps.concat(makeDeclDeps(block.name, decls, deferred, deferredBundles))
		deps = deps.concat(makeItemsDeps(block.items, decls, deferred, deferredBundles))
	}

	deps.push(declName)
	deps = deps.concat(makeItemsDeps(decl.items, decls, deferred, deferredBundles))

	return _.uniq(deps)
}

function makeItemsDeps(items, decls, deferred, deferredBundles) {
	var deps = []
	for (var i in items) {
		var item = items[i]
		deps = deps.concat(makeDeclDeps(item, decls, deferred, deferredBundles))
		deps.push(item)
	}
	return deps
}

/**
 * @param declName {string}
 * @param reader {DeclReader}
 * @return List of deps of each bundle.
 */
function makeDeps(declName, reader) {
	var declsData = getDeclsData(declName, reader)
	var bundles = declsData.bundles
	var deferredBundles = declsData.deferredBundles
	var decls = declsData.decls
	var deps = {}

	bundles = _.union(bundles, [declName], deferredBundles)

	for (var i in bundles) {
		var bundleName = bundles[i]
		var deferred = deferredBundles.indexOf(bundleName) != -1
		var bundleDeps = makeDeclDeps(bundleName, decls, deferred, deferredBundles)
		// Deps of bundle are its deps without deps of prev bundles.
		deps[bundleName] = _.difference(bundleDeps, _.flatten(_.values(deps)))
	}

	return deps
}

module.exports = makeDeps
