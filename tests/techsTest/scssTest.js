var assert = require('assert')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')
var _ = require('underscore')

var Builder = require('../../src/Builder')

describe('scss', function() {
	var DIR = path.join(__dirname, 'scssTest')
	var OPTIONS = {
		blockName: 'index',
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

	var RESULT = '.index {\n' +
  	'  color: #F00; }'

	it('builds scss to css', function() {
		var options = _.defaults(OPTIONS, {
			levels: [path.join(DIR, 'blocks')]
		})
		var bem = Builder(options)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var css = fs.readFileSync(path.join(dir, 'styles/index.css'), 'utf8')
			assert.equal(css.slice(0, RESULT.length), RESULT)
		})
	})

	it('mixins are available in scss files from top level', function() {
		var options = _.defaults(OPTIONS, {
			levels: [path.join(DIR, 'mixins')]
		})
		var bem = Builder(options)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var css = fs.readFileSync(path.join(dir, 'styles/index.css'), 'utf8')
			assert.equal(css.slice(0, RESULT.length), RESULT)
		})
	})
})
