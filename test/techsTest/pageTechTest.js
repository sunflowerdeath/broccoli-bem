var assert = require('assert')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var broccoli = require('broccoli')

var Builder = require('../../src/builder')

describe('page tech', function() {
	var DIR = path.join(__dirname, 'pageTechTest')
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})

	var OPTIONS = {
		blockName: 'index',
		techs: ['page'],
		debug: true
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
			techs: ['page', 'css', 'js']
		})

		var bem = Builder(options)
		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var page = fs.readFileSync(path.join(dir, 'html', 'index.html'), 'utf8')
			assert(page.indexOf('/deploy/scripts/index.js') !== -1)
			assert(page.indexOf('/deploy/styles/index.css') !== -1)
		})
	})

})
