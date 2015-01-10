var assert = require('assert')

var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')

var Builder = require('../../src/Builder')

describe('webfont', function() {
	var DIR = path.join(__dirname, 'webfont test')
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})
	
	xit('builds webfonts and styles to special level', function() {
		var level = path.join(DIR, 'blocks')
		var bem = Builder({
			blockName: 'index',
			techs: ['webfont'],
			levels: [level]
		})
	})
})
