var assert = require('assert')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')
var _ = require('underscore')

var Builder = require('../../src/Builder')

describe('Builder', function() {
	var DIR = path.join(__dirname, 'scssTest')
	var CONFIG = {
		declName: 'index',
		techs: ['css', 'scss'],
		techModules: [
			{css: require('../../src/techs/css')},
			{scss: require('../../src/techs/scss')}
		]
	}

	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})

	it('builds scss to css', function() {
		var config = _.defaults(CONFIG, {
			levels: [path.join(DIR, 'blocks')]
		})
		var bem = Builder(config)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var index = fs.readFileSync(path.join(dir, 'styles/index.css'), 'utf8')
			var indexRef = fs.readFileSync(path.join(DIR, 'indexRef.css'), 'utf8')
			assert.equal(index, indexRef)
		})
	})

	it('mixins are available in scss files', function() {
		var config = _.defaults(CONFIG, {
			levels: [path.join(DIR, 'mixins')]
		})
		var bem = Builder(config)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory

			var index = fs.readFileSync(path.join(dir, 'styles/index.css'), 'utf8')
			var indexRef = fs.readFileSync(path.join(DIR, 'mixinsRef.css'), 'utf8')
			assert.equal(index, indexRef)
		})
	})
})
