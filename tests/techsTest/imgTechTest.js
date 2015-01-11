var assert = require('assert')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')

var Builder = require('../../src/builder')

describe('img tech', function() {
	var DIR = path.join(__dirname, 'imgTechTest')
	var builder

	var IMAGES = fs.readdirSync(path.join(DIR, 'index'))

	afterEach(function() {
		if (builder) builder.cleanup()
	})
	
	it('copies images to "images" dir', function() {
		var level = DIR
		var bem = Builder({
			blockName: 'index',
			techs: ['img'],
			levels: [level]
		})

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var copied = fs.readdirSync(dir, 'images')
			assert.deepEqual(copied, IMAGES)
		})
	})
})
