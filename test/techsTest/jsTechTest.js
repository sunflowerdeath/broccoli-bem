var assert = require('assert')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')
var _ = require('underscore')

var Builder = require('../../src/builder')

describe('js tech', function() {
	var DIR = path.join(__dirname, 'jsTechTest')

	var OPTIONS = {
		blockName: 'index',
		techs: ['js'],
		levels: [path.join(DIR, 'blocks')]
	}
	
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

	it('builds js to concatenated files', function() {
		builder = new broccoli.Builder(Builder(OPTIONS))
		return builder.build().then(function(result) {
			var dir = result.directory
			var index = fs.readFileSync(path.join(dir, 'scripts/index.js'), 'utf8')
			var bundle = fs.readFileSync(path.join(dir, 'scripts/bundle.js'), 'utf8')
			assert(!checkOccurence(index, ['var DEBUG = true']))
			assert(checkOccurence(index, ['block', 'block__elem', 'index', 'index__elem']))
			assert(checkOccurence(bundle, ['bundle']), 'bundles are built separately')
		})
	})

	it('builds with sourcemaps when debug', function() {
		var debugOptions = _.defaults(OPTIONS, {debug: true})
		builder = new broccoli.Builder(Builder(debugOptions))
		return builder.build().then(function(result) {
			var dir = result.directory
			var index = fs.readFileSync(path.join(dir, 'scripts/index.js'), 'utf8')
			assert(checkOccurence(index, ['var DEBUG = true']))
			assert(checkOccurence(index, ['block', 'block__elem', 'index', 'index__elem']))
			assert(checkOccurence(index, ['sourceMappingURL=index.js.map']), 'script uses map')
			assert(fs.existsSync(path.join(dir, 'scripts/index.js.map')), 'map exists')
		})
	})
})
