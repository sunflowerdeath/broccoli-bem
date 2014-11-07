var assert = require('assert')
var path = require('path')
var _ = require('underscore')
var sinon = require('sinon')

var DeclReader = require('../src/DeclReader')

describe('DeclReader', function() {

	var ONE_LEVEL = [path.join(__dirname, 'DeclReaderTest/oneLevel')]
	var ERROR = [path.join(__dirname, 'DeclReaderTest/error')]
	var MULTIPLE_LEVELS = [
		path.join(__dirname, 'DeclReaderTest/multipleLevels/level1'),
		path.join(__dirname, 'DeclReaderTest/multipleLevels/level2')
	]
	var TRAVERSE_ONCE = [path.join(__dirname, 'DeclReaderTest/traverseOnce')]
	var TRAVERSE_RECURSIVELY = [path.join(__dirname, 'DeclReaderTest/traverseRecursively')]

	it('finds decl files', function() {
		var reader = new DeclReader(ONE_LEVEL)
		var files = reader.files
		var keys = Object.keys(files)
		assert.deepEqual(keys, ['block', 'index'])
		assert.equal(
			path.normalize(files.block[0]),
			path.normalize(path.join(ONE_LEVEL[0], 'block.decl.json'))
		)
	})

	it('groups same decl files together', function() {
		var reader = new DeclReader(MULTIPLE_LEVELS)
		assert.equal(reader.files.index.length, 2)
	})

	describe('readDeclFromFiles', function() {
		it('reads decl from file', function() {
			var reader = new DeclReader(ONE_LEVEL)
			var decl = reader.readDeclFromFiles('index')

			assert.deepEqual(decl.blocks, [{name: 'block', items: ['block__elem']}])
			assert.deepEqual(decl.items, ['index__elem'])
		})

		it('merges decls from multiple files', function() {
			var reader = new DeclReader(MULTIPLE_LEVELS)
			var decl = reader.readDeclFromFiles('index')

			assert.deepEqual(decl.items, ['index__elem', 'index__elem2'], 'items not merged')
			
			var blocks = _.pluck(decl.blocks, 'name')
			assert.deepEqual(blocks, ['block', 'block2'], 'blocks not merged')
			
			var blockItems = _.findWhere(decl.blocks, {name: 'block'}).items
			assert.deepEqual(blockItems, ['block__elem', 'block__elem2'], 'block items not merged')
		})

		it('returns initial decl when it has not file', function() {
			var reader = new DeclReader(ONE_LEVEL)
			var decl = reader.readDeclFromFiles('initial')
			assert.deepEqual(decl, {items: [], blocks: []})
		})

		it('throws when reading bad json', function() {
			var reader = new DeclReader(ERROR)
			
			var thrown
			try {
				reader.readDeclFromFiles('error')
			} catch(e) {
				thrown = true
			}

			assert(thrown)
		})
	})

	describe('traverse', function() {
		it('traverses all deps of decl', function() {
			var reader = new DeclReader(ONE_LEVEL)
			
			var traversed = []
			reader.traverse('index', function(name, decl) {
				traversed.push(name)
			})
			assert.deepEqual(traversed, ['index', 'block', 'block2', 'block__elem', 'index__elem'])
		})

		it('traverses deps only once', function() {
			var reader = new DeclReader(TRAVERSE_ONCE)
			var traversed = []
			reader.traverse('index', function(name, decl) {
				traversed.push(name)
			})
			assert.deepEqual(traversed, _.unique(traversed))
		})

		it('traverses recursively', function() {
			var reader = new DeclReader(TRAVERSE_RECURSIVELY)
			var traversed = []
			reader.traverse('index', function(name, decl) {
				traversed.push(name)
			})
			assert.deepEqual(traversed, ['index', 'block', 'block2'])
		})

		it('reads decls from files when traversing', function() {
			var reader = new DeclReader(ONE_LEVEL)
			
			var spy = sinon.spy(reader, 'readDeclFromFiles')
			var traversed = []
			reader.traverse('index', function(name, decl) {
				traversed.push(name)
			})
			assert.equal(spy.callCount, traversed.length)
			assert.deepEqual(traversed, Object.keys(reader.decls))
		})

		it('does not read decls when traversing again', function() {
			var reader = new DeclReader(ONE_LEVEL)
			
			var spy = sinon.spy(reader, 'readDeclFromFiles')
			reader.traverse('index', function() {})
			var callCount = spy.callCount
			reader.traverse('index', function() {})
			assert.equal(spy.callCount, callCount)
		})
	})
})