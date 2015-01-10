var assert = require('assert')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')

var scss = require('../../src/plugins/scssPlugin')

describe('scss plugin', function() {
	var DIR = path.join(__dirname, 'scssPluginTest')

	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})

	it('should preprocess scss files', function() {
		var tree = scss(DIR)
		builder = new broccoli.Builder(tree)
		return builder.build().then(function(result) {
			var dir = result.directory
			var file = fs.readFileSync(path.join(dir, 'file.css'), 'utf-8')
			var refFile = fs.readFileSync(path.join(DIR, 'fileRef.css'), 'utf-8')
			assert.equal(file, refFile)
		})
	})
	
	xit('should pass options to node-sass', function() {
		//TODO
	})

})
