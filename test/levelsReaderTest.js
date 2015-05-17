var assert = require('assert')
var path = require('path')
var fs = require('fs')
var broccoli = require('broccoli')

var LevelsReader = require('../src/levelsReader')

describe('LevelsReader', function() {
	var DIR = path.join(__dirname, 'levelsReaderTest')
	var LEVELS = [
		path.join(DIR, 'level1'),
		path.join(DIR, 'level2')
	]
	var DEPS = {
		index: ['block1', 'block2']
	}

	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})

	it('creates dir with levels dirs named from 0', function() {
		var tree = LevelsReader(LEVELS, DEPS, ['css'])
		builder = new broccoli.Builder(tree)
		return builder.build()
			.then(function(results) {
				var outputDir = results.directory
				var dirs = fs.readdirSync(outputDir)
				assert.equal(dirs[0][0], '0')
				assert.equal(dirs[1][0], '1')
			})
	})

	it('puts matching tech files from levels to created folders', function() {
		var tree = LevelsReader(LEVELS, DEPS, ['css'])
		builder = new broccoli.Builder(tree)
		return builder.build()
			.then(function(results) {
				var outputDir = results.directory
				var dirs = fs.readdirSync(outputDir)
				var files = [
					fs.readdirSync(path.join(outputDir, dirs[0])),
					fs.readdirSync(path.join(outputDir, dirs[1]))
				]
				assert.deepEqual(files, [['block1.css'], ['block2.css']])
			})
	})

})
