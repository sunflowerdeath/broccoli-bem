var assert = require('assert')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var broccoli = require('broccoli')

var Builder = require('../../src/builder')

describe('handlebarsPage tech', function() {
	var DIR = path.join(__dirname, 'handlebarsPageTechTest')
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})

	var OPTIONS = {
		blockName: 'index',
		debug: true,
		techs: ['handlebarsPage']
	}

	it('renders templates', function() {
		var options = _.extend({}, OPTIONS, {
			levels: [path.join(DIR, 'simple')],
		})

		var bem = Builder(options)
		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var page = fs.readFileSync(path.join(dir, 'html', 'index.html'), 'utf8')
			assert.equal(page, 'page\n')
		})
	})

	it('uses partials', function() {
		var options = _.extend(OPTIONS, {
			levels: [path.join(DIR, 'partials')],
		})

		var bem = Builder(options)
		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var page = fs.readFileSync(path.join(dir, 'html', 'index.html'), 'utf8')
			assert.equal(page, 'partial\n')
		})
	})

	it('makes object with files', function() {
		var options = _.extend(OPTIONS, {
			levels: [path.join(DIR, 'files')],
			techs: ['handlebarsPage', 'css', 'js']
		})

		var bem = Builder(options)
		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var page = fs.readFileSync(path.join(dir, 'html', 'index.html'), 'utf8')
			assert(page.indexOf('/scripts/index.js') !== -1)
			assert(page.indexOf('/styles/index.css') !== -1)
		})
	})

	it('makes hashes of files', function() {
		var options = _.extend(OPTIONS, {
			levels: [path.join(DIR, 'files')],
			techs: ['handlebarsPage', 'css', 'js']
		})

		var bem = Builder(options)
		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var page = fs.readFileSync(path.join(dir, 'html', 'index.html'), 'utf8')
			assert(page.match(/index\.js\?[0-9a-f]{32}/gi))
		})
	})

})
