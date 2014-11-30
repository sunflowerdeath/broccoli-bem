var assert = require('assert')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')

var Builder = require('../../src/Builder')

describe('css', function() {
	var DIR = path.join(__dirname, 'cssTest')
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})
	
	it('builds css to concatenated files', function() {
		var level = path.join(DIR, 'blocks')
		var bem = Builder({
			blockName: 'index',
			techs: ['css'],
			levels: [level],
			techModules: [
				{css: require('../../src/techs/css')}
			]
		})

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var index = fs.readFileSync(path.join(dir, 'styles/index.css'), 'utf8')
			var ie8 = fs.readFileSync(path.join(dir, 'styles/index.ie8.css'), 'utf8')
			var module = fs.readFileSync(path.join(dir, 'styles/module.css'), 'utf8')

			var indexRef = fs.readFileSync(path.join(DIR, 'indexRef.css'), 'utf8')
			var ie8Ref = fs.readFileSync(path.join(DIR, 'ie8Ref.css'), 'utf8')
			var moduleRef = fs.readFileSync(path.join(DIR, 'moduleRef.css'), 'utf8')

			assert.equal(index, indexRef)
			assert.equal(ie8, ie8Ref)
			assert.equal(module, moduleRef)
		})
	})
})
