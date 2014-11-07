var assert = require('assert')
var path = require('path')
var _ = require('underscore')

var DeclReader = require('../src/DeclReader')
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
		index__elem: {
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

	var MODULES = {
		index: {
			blocks: [
				{name: 'module'},
				{name: 'deferred'},
				{name: 'block'}
			],
			items: []
		},
		module: {
			module: true,
			blocks: [
				{name: 'block'}
			],
			items: ['module__dep']
		},
		deferred: {
			module: true,
			deferred: true,
			blocks: [],
			items: []
		}
	}

	it('finds modules and deferred modules', function() {
		var reader = new DeclReader()
		reader.decls = MODULES
		var deps = makeDeps('index', reader)
		var modules = Object.keys(deps)
		assert.deepEqual(modules, ['module', 'index', 'deferred'])
	})
	
	it('modules does not include dependencies of previous modules', function() {
		var reader = new DeclReader()
		reader.decls = MODULES
		var moduleDeps = makeDeps('module', reader)
		var indexDeps = makeDeps('index', reader)
		assert.deepEqual(_.difference(indexDeps.index, moduleDeps.module), indexDeps.index)
		assert.deepEqual(indexDeps.module, moduleDeps.module)
	})
	
	var DEFERRED_MODULES = {
		index: {
			blocks: [
				{name: 'deferred'},
				{name: 'block'}
			],
			items: []
		},
		deferred: {
			module: true,
			deferred: true,
			blocks: [
				{name: 'block'},
				{name: 'block2'}
			],
			items: []
		}
	}

	it('deferred modules include dependencies not included to static modules', function() {
		var reader = new DeclReader()
		reader.decls = DEFERRED_MODULES
		
		var deferredDeps = makeDeps('deferred', reader) 
		var indexDeps = makeDeps('index', reader)
		
		//deps of deferred module should be
		//all deps of deferred module without deps included to index module
		assert.deepEqual(
			indexDeps.deferred,
			_.difference(deferredDeps.deferred, indexDeps.index)
		)
		//in this example it means that block is not included to deferred module
		//beacuse it is included already to index module
		assert.deepEqual(indexDeps.deferred, ['block2', 'deferred'])
	})
	
})