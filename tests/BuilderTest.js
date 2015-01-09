var assert = require('assert')
var sinon = require('sinon')
var broccoli = require('broccoli')
var path = require('path')
var fs = require('fs')
var proxyquire = require('proxyquire').noPreserveCache()

//fake dependencies
var FakeDeclReader = sinon.spy(function() {})

var fakeDeps = {}
var fakeMakeDeps = sinon.spy(function() {
	//returns empty object to compare with (Techs & LevelsReader are fake and dont use deps)
	return fakeDeps
})

var FakeLevelsReader = function(deps, config, suffixes) {
	this.suffixes = suffixes
}
FakeLevelsReader.prototype.read = sinon.spy(function() {
	//returns existing directory
	return path.join(__dirname, 'BuilderTest', this.suffixes[0])
})
FakeLevelsReader.prototype.cleanup = function() {}
FakeLevelsReader = sinon.spy(FakeLevelsReader)

var FakeTechTree = sinon.spy(function(levelsTree) {
	this.levelsTree = levelsTree
})
FakeTechTree.prototype.read = sinon.spy(function(readTree) {
	//returns input levelsTree
	return readTree(this.levelsTree)
})
FakeTechTree.prototype.cleanup = function() {}
FakeTechTree = sinon.spy(FakeTechTree)

var Builder = proxyquire('../src/Builder', {
	'./DeclReader': FakeDeclReader,
	'./makeDeps': fakeMakeDeps,
	'./LevelsReader': FakeLevelsReader
})

describe('Builder', function() {
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
		
		//reset spies
		FakeDeclReader.reset()
		fakeMakeDeps.reset()
		FakeLevelsReader.reset()
		FakeLevelsReader.prototype.read.reset()
		FakeTechTree.reset()
		FakeTechTree.prototype.read.reset()
	})

	it('builds tech', function() {
		var suffix = 'js'

		var fakeTech = {
			suffixes: [suffix],
			Tree: FakeTechTree
		}

		var config = {
			isConfig: true,
			levels: ['level'],
			blockName: 'index',
			techs: ['tech'],
			techModules: [{tech: fakeTech}]
		}
		
		var bem = Builder(config)
		
		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			//check that dependencies are created correctly
			assert(FakeDeclReader.calledWith(config.levels))

			var args = fakeMakeDeps.lastCall.args
			assert.equal(args[0], config.blockName)
			assert(args[1] instanceof FakeDeclReader)

			//check that LevelsReader for tech is created
			var args = FakeLevelsReader.lastCall.args
			assert.deepEqual(args[0], config.levels)
			assert.equal(args[1], fakeDeps)
			assert.equal(args[2], suffix)

			//check that tech's Tree is created
			var args = FakeTechTree.lastCall.args
			assert.equal(args[1], fakeDeps)
			assert(args[2].isConfig)

			//check that tech runs and returns result (copied js files)
			assert(FakeTechTree.prototype.read.called)
			assert.deepEqual(fs.readdirSync(result.directory), ['index.js'])
		})
	})
	
	it('changes deps with techs changeDeps methods', function() {
		var fakeChangedDeps = {}
		
		var fakeTech = {
			suffixes: ['js'],
			Tree: FakeTechTree,
			changeDeps: sinon.spy(function() {
				return fakeChangedDeps
			})
		}

		var config = {
			blockName: 'index',
			techs: ['tech'],
			techModules: [{tech: fakeTech}]
		}
		
		var bem = Builder(config)
		
		builder = new broccoli.Builder(bem)
		return builder.build().then(function() {
			//changeDeps is called
			var args = fakeTech.changeDeps.lastCall.args
			assert.equal(args[0], fakeDeps)
			assert(args[1] instanceof FakeDeclReader)
			
			//tech gets changed deps
			var args = FakeTechTree.lastCall.args
			assert.equal(args[1], fakeChangedDeps)
		})
	})

	it('runs techs with leveltrees merged with dependent techs results', function() {
		//js tech depends on css tech
		var jsTech = {
			suffixes: ['js'],
			Tree: sinon.spy(FakeTechTree),
			prevTechs: ['css']
		}
		var cssTech = {
			suffixes: ['css'],
			Tree: sinon.spy(FakeTechTree)
		}

		var config = {
			blockName: 'index',
			techs: ['js', 'css'],
			techModules: [{
				js: jsTech,
				css: cssTech
			}]
		}

		var bem = Builder(config)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function() {
			var readTree = FakeTechTree.prototype.read.lastCall.args[0]
			//levelsTree for js tech must have results of css tech merged with js files
			var jsLevelTree = jsTech.Tree.lastCall.args[0]
			return readTree(jsLevelTree).then(function(jsLevelsDir) {
				assert.deepEqual(fs.readdirSync(jsLevelsDir), ['index.css', 'index.js'])
			})
		})
	})

	xit('outputs merged results of techs', function() {})

	xit('doesnt output preprocessors results', function() {})
	
	xit('outputs postprocessor result instead of builder result', function() {})
})

describe('Builder init', function() {
	it('throws if blockName is not specified', function() {
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

	it('changes options with techs changeOptions method', function() {
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
