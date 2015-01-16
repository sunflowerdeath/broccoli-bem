var assert = require('assert')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var broccoli = require('broccoli')

var Builder = require('../../src/builder')

describe('css tech', function() {
	var DIR = path.join(__dirname, 'cssTechTest')
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})
	
	var checkOccurence = function(str, items) {
		for (var i in items) {
			if (str.indexOf(items[i]) === -1) return false
		}
		return true
	}

	var OPTIONS = {
		blockName: 'index',
		techs: ['css'],
		levels: [path.join(DIR, 'blocks')],
		debug: true
	}

	it('builds css to concatenated files with maps when debug', function() {
		var bem = Builder(OPTIONS)

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var index = fs.readFileSync(path.join(dir, 'styles/index.css'), 'utf8')
			var ie8 = fs.readFileSync(path.join(dir, 'styles/index.ie8.css'), 'utf8')
			var bundle = fs.readFileSync(path.join(dir, 'styles/bundle.css'), 'utf8')

			assert(checkOccurence(index, ['block', 'block__elem', 'index', 'index__elem']))
			assert(checkOccurence(ie8, ['indexie8']), 'browser specific code is built separately')
			assert(checkOccurence(bundle, ['bundle']), 'bundles are built separately')
			assert(checkOccurence(index, 'sourceMappingURL=index.map.css'))
		})
	})

	it('minify css when not debug', function() {
		var debugTree = Builder(OPTIONS)
		var minifyTree = Builder(_.extend({}, OPTIONS, {debug: false}))
		
		var debugSize, minifiedSize

		builder = new broccoli.Builder(debugTree)
		return builder.build()
			.then(function(result) {
				var css = fs.readFileSync(path.join(result.directory, 'styles/index.css'), 'utf-8')
				debugSize = css.length
				builder.cleanup()
				builder = new broccoli.Builder(minifyTree)
				return builder.build()
			})
			.then(function(result) {
				var css = fs.readFileSync(path.join(result.directory, 'styles/index.css'), 'utf-8')
				minifiedSize = css.length
				assert(debugSize > minifiedSize)
				assert(!checkOccurence(css, 'sourceMappingURL'))
			})
	})
})
