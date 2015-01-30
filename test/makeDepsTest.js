var assert = require('assert')
var _ = require('underscore')

var DeclReader = require('../src/declReader')
var makeDeps = require('../src/makeDeps')

describe('makeDeps', function() {
	var SIMPLE_DEPS = {
		index: {
			blocks: [
				{name: 'block', items: ['block__elem']}
			],
			items: ['index__elem']
		}
	}

	it('resolves all dependencies of decl', function() {
		var reader = new DeclReader()
		reader.decls = SIMPLE_DEPS
		var deps = makeDeps('index', reader)
		assert.deepEqual(deps.index, ['block', 'block__elem', 'index', 'index__elem'])
	})
	
	var RECURSIVE_BLOCK_DEPS = {
		index: {
			blocks: [{name: 'block'}],
			items: []
		},
		block: {
			blocks: [{name: 'block2'}],
			items: []
		}
	}
	
	it('resolves blocks dependencies recursively', function() {
		var reader = new DeclReader()
		reader.decls = RECURSIVE_BLOCK_DEPS
		var deps = makeDeps('index', reader)
		assert.deepEqual(deps.index, ['block2', 'block', 'index'])
	})
	
	var RECURSIVE_ITEMS_DEPS = {
		index: {
			blocks: [],
			items: ['index__elem']
		},
		'index__elem': {
			blocks: [{name: 'block'}],
			items: []
		}
	}

	it('resolves items dependencies recursively', function() {
		var reader = new DeclReader()
		reader.decls = RECURSIVE_ITEMS_DEPS
		var deps = makeDeps('index', reader)
		assert.deepEqual(deps.index, ['index', 'block', 'index__elem'])
	})

	var BUNDLES = {
		index: {
			blocks: [
				{name: 'bundle'},
				{name: 'deferred'},
				{name: 'block'}
			],
			items: []
		},
		bundle: {
			bundle: true,
			blocks: [
				{name: 'block'}
			],
			items: ['bundle__dep']
		},
		deferred: {
			bundle: true,
			deferred: true,
			blocks: [],
			items: []
		}
	}

	it('finds bundles and deferred bundles', function() {
		var reader = new DeclReader()
		reader.decls = BUNDLES
		var deps = makeDeps('index', reader)
		var bundles = Object.keys(deps)
		assert.deepEqual(bundles, ['bundle', 'index', 'deferred'])
	})
	
	it('bundles does not include dependencies of previous bundles', function() {
		var reader = new DeclReader()
		reader.decls = BUNDLES
		var bundleDeps = makeDeps('bundle', reader)
		var indexDeps = makeDeps('index', reader)
		assert.deepEqual(_.difference(indexDeps.index, bundleDeps.bundle), indexDeps.index)
		assert.deepEqual(indexDeps.bundle, bundleDeps.bundle)
	})
	
	var DEFERRED_BUNDLES = {
		index: {
			blocks: [
				{name: 'deferred'},
				{name: 'block'}
			],
			items: []
		},
		deferred: {
			bundle: true,
			deferred: true,
			blocks: [
				{name: 'block'},
				{name: 'block2'}
			],
			items: []
		}
	}

	it('deferred bundles include dependencies not included to static bundles', function() {
		var reader = new DeclReader()
		reader.decls = DEFERRED_BUNDLES
		
		var deferredDeps = makeDeps('deferred', reader) 
		var indexDeps = makeDeps('index', reader)
		
		// Deps of deferred bundle should be
		// all deps of deferred bundle without deps included to index bundle.
		assert.deepEqual(
			indexDeps.deferred,
			_.difference(deferredDeps.deferred, indexDeps.index)
		)
		// In this example it means that block is not included to deferred bundle,
		// beacuse it is included already to index bundle.
		assert.deepEqual(indexDeps.deferred, ['block2', 'deferred'])
	})
	
})
