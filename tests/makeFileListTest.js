var assert = require('assert')
var path = require('path')
var _ = require('underscore')
var broccoli = require('broccoli')
var Funnel = require('broccoli-funnel')

var makeFileList = require('../src/makeFileList')

describe('makeFileList', function() {
	var DIR = path.join(__dirname, 'makeFileListTest')
	var DEPS = {
		index: ['block1', 'block2']
	}
	
	var builder
  afterEach(function() {
    if (builder) builder.cleanup()
  })

	it('creates fileList from levelsTree', function() {
		var tree = {
			read: function(readTree) {
				return makeFileList(readTree, DIR, DEPS, '.css')
					.then(function(fileList) {
						var normalized = _.map(fileList.index, function(file) { return path.normalize(file) })
						assert.deepEqual(normalized, [
								path.join(DIR, '0', 'block1.css'),
								path.join(DIR, '1', 'block2.css')
						])
						return '.'
					})
			},
			cleanup: function() {}
		}
		builder = new broccoli.Builder(tree)
		return builder.build()
	})

})