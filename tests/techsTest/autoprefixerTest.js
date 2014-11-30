var assert = require('assert')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')

var Builder = require('../../src/Builder')

describe('autoprefixer', function() {
	var DIR = path.join(__dirname, 'autoprefixerTest')
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})

	it('processes created css files', function() {
		var bem = Builder({
			blockName: 'index',
			techs: ['css', 'autoprefixer'],
			levels: [DIR]
		})

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var index = fs.readFileSync(path.join(dir, 'styles/index.css'), 'utf8')

			assert(index.indexOf('webkit') !== -1)
		})
	})
})
