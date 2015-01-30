var assert = require('assert')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')
var _ = require('underscore')

var Builder = require('../../src/builder')

describe('es6 tech', function() {
	var DIR = path.join(__dirname, 'es6TechTest')
	var OPTIONS = {
		blockName: 'index',
		techs: ['es6', 'js'],
		debug: true
	}

	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})

	it('builds es6 to js', function() {
		var options = _.defaults(OPTIONS, {
			levels: [DIR]
		})
		var bem = Builder(options)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var js = fs.readFileSync(path.join(dir, 'scripts/index.js'), 'utf8')
			assert(js.indexOf('`') === -1)
		})
	})

	it('builds 6to5-browser-polyfill', function() {
		var options = _.defaults(OPTIONS, {
			levels: [DIR]
		})
		var bem = Builder(options)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			fs.existsSync(path.join(dir, 'scripts/6to5-browser-polyfill.js'))
		})
	})
})
