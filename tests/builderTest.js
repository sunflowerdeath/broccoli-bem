var assert = require('assert')
var sinon = require('sinon')
var broccoli = require('broccoli')
var path = require('path')
var fs = require('fs')
var proxyquire = require('proxyquire').noPreserveCache()

var DIR = path.join(__dirname, 'builderTest')

// Fake objects

var FakeDeclReader = sinon.spy(function() {})


var fakeDeps = {}
var fakeMakeDeps = sinon.spy(function() {
	// Returns empty object to compare with.
	// Tech trees & LevelsReader are also fake, so they don't need deps.
	return fakeDeps
})


// Returns directory with one file with specified suffix (index.js, index.css)
var FakeLevelsReader = function(deps, config, suffixes) {
	this.suffixes = suffixes
}
FakeLevelsReader.prototype.read = sinon.spy(function() {
	return path.join(DIR, this.suffixes[0])
})
FakeLevelsReader.prototype.cleanup = function() {}
FakeLevelsReader = sinon.spy(FakeLevelsReader)


// Returns input levelsTree
var FakeTechTree = sinon.spy(function(levelsTree) {
	this.levelsTree = levelsTree
})
FakeTechTree.prototype.read = sinon.spy(function(readTree) {
	return readTree(this.levelsTree)
})
FakeTechTree.prototype.cleanup = function() {}
FakeTechTree = sinon.spy(FakeTechTree)


var Builder = proxyquire('../src/builder', {
	'./declReader': FakeDeclReader,
	'./makeDeps': fakeMakeDeps,
	'./levelsReader': FakeLevelsReader
})


describe('Builder', function() {
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
		
		// Reset spies
		FakeDeclReader.reset()
		fakeMakeDeps.reset()
		FakeLevelsReader.reset()
		FakeLevelsReader.prototype.read.reset()
		FakeTechTree.reset()
		FakeTechTree.prototype.read.reset()
	})


	it('builds tech', function() {
		var fakeTech = {
			suffixes: ['js'],
			Tree: FakeTechTree
		}

		var options = {
			isOptions: true,
			levels: ['level'],
			blockName: 'index',
			techs: ['tech'],
			techModules: [{tech: fakeTech}]
		}
		
		var bem = Builder(options)
		
		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			// Dependencies are created with DeclReader
			assert(FakeDeclReader.calledWith(options.levels))

			var args = fakeMakeDeps.lastCall.args
			assert.equal(args[0], options.blockName)
			assert(args[1] instanceof FakeDeclReader)

			// LevelsReader for tech is created
			var args = FakeLevelsReader.lastCall.args
			assert.deepEqual(args[0], options.levels)
			assert.equal(args[1], fakeDeps)
			assert.deepEqual(args[2], fakeTech.suffixes)

			// Tech's Tree is created
			var args = FakeTechTree.lastCall.args
			assert.equal(args[1], fakeDeps)
			assert(args[2].isOptions)

			// Tech runs and returns result (copied js files)
			assert(FakeTechTree.prototype.read.called)
			assert.deepEqual(fs.readdirSync(result.directory), ['index.js'])
		})
	})


	it('changes deps with techs "changeDeps" methods', function() {
		var fakeChangedDeps = {}
		
		var fakeTech = {
			suffixes: ['js'],
			Tree: FakeTechTree,
			changeDeps: sinon.spy(function() {
				return fakeChangedDeps
			})
		}

		var options = {
			blockName: 'index',
			techs: ['tech'],
			techModules: [{tech: fakeTech}]
		}
		
		var bem = Builder(options)
		
		builder = new broccoli.Builder(bem)
		return builder.build().then(function() {
			// ChangeDeps is called
			var args = fakeTech.changeDeps.lastCall.args
			assert.equal(args[0], fakeDeps)
			assert(args[1] instanceof FakeDeclReader)
			
			// Tech gets changed deps
			var args = FakeTechTree.lastCall.args
			assert.equal(args[1], fakeChangedDeps)
		})
	})


	it('merges leveltrees with dependent techs results', function() {
		// js tech depends on css tech
		var jsTech = {
			suffixes: ['js'],
			Tree: sinon.spy(FakeTechTree),
			prevTechs: ['css']
		}
		var cssTech = {
			suffixes: ['css'],
			Tree: sinon.spy(FakeTechTree)
		}

		var options = {
			blockName: 'index',
			techs: ['js', 'css'],
			techModules: [{
				js: jsTech,
				css: cssTech
			}]
		}

		var bem = Builder(options)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function() {
			var readTree = FakeTechTree.prototype.read.lastCall.args[0]
			// levelsTree for js tech must have results of css tech merged with js files
			var jsLevelTree = jsTech.Tree.lastCall.args[0]
			return readTree(jsLevelTree).then(function(jsLevelsDir) {
				assert.deepEqual(fs.readdirSync(jsLevelsDir), ['index.css', 'index.js'])
			})
		})
	})


	xit('outputs merged results of techs', function() {})


	it('does not output preprocessors results', function() {
		var jsTech = {
			Tree: FakeTechTree,
			suffixes: 'js',
			preprocessor: true
		}

		var options = {
			blockName: 'index',
			techs: ['js'],
			techModules: [{
				js: jsTech
			}]
		}

		var bem = Builder(options)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var result = fs.readdirSync(result.directory)
			assert.equal(result.length, 0)
		})
	})


	it('outputs postprocessor result instead of processed techs\'s result', function() {
		// Css tech have postprocessor.
		// Postprocessor's result is file 'index.post'.
		// Css tech's result is file 'index.css'.
		// Build result should have only postprocessor's result.

		var PostprocessorTree = function() {}
		PostprocessorTree.prototype.read = function() {
			return path.join(DIR, 'postprocessor')
		}
		PostprocessorTree.prototype.cleanup = function() {}

		var postprocessorTech = {
			Tree: PostprocessorTree,
			postprocessor: true,
			prevTechs: ['css']
		}

		var cssTech = {
			Tree: FakeTechTree,
			suffixes: 'css'
		}

		var options = {
			blockName: 'index',
			techs: ['css', 'postprocessor'],
			techModules: [{
				css: cssTech,
				postprocessor: postprocessorTech
			}]
		}

		var bem = Builder(options)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var result = fs.readdirSync(result.directory)
			assert.deepEqual(result, ['index.post'])
		})
	})


	xit('caches techs trees when deps are same', function() {
		// TODO
		// create builder with 1 tech
		// make makeDeps return something
		// build
		// assert tech builder's and leveltree's constructors called
		// make makeDeps return equal but not same object
		// build again
		// assert constructors to be not called again
		// make makeDeps return different deps
		// build again
		// assert constructors to be called again
	})
})


describe('Builder init', function() {
	it('throws if "blockName" is not specified', function() {
		var thrown
		try {
			Builder()
		} catch(e) {
			thrown = true
		}
		assert(thrown)
	})

	it('throws if unknown tech is specified', function() {
		var thrown
		try {
			Builder({
				blockName: 'index',
				techs: ['unknown']
			})
		} catch(e) {
			thrown = true
		}
		assert(thrown)
	})

	it('changes options with techs "changeOptions" method', function() {
		var tech = {
			changeOptions: sinon.spy(function(options) {
				options.changed = 'changed'
			})
		}
		sinon.spy(tech.changeOptions)
		var options = {
			blockName: 'index',
			techModules: [
				{tech: tech}
			],
			techs: ['tech']
		}
		Builder(options)
		assert(tech.changeOptions.calledWith(options))
		assert.equal(options.changed, 'changed')
	})
})