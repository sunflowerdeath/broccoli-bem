var assert = require('assert')

var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')

var Builder = require('../../src/builder')

describe('webfont tech', function() {
	var DIR = path.join(__dirname, 'webfontTechTest')
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})

	it('builds webfonts and styles', function() {
		var bem = Builder({
			blockName: 'index',
			techs: ['webfont', 'css', 'scss', 'img'],
			levels: [DIR]
		})
		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory

			var fontsCreated = fs.existsSync(path.join(dir, 'images', 'index.woff')) &&
				fs.existsSync(path.join(dir, 'images', 'index.eot'))
			assert(fontsCreated, 'font files are created')

			var css = fs.readFileSync(path.join(dir, 'styles', 'index.css'), 'utf-8')
			assert(css.indexOf('@font-face') !== -1, 'font is used in css')
		})
	})
})
