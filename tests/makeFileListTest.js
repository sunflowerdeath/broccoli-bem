var assert = require('assert')
var path = require('path')
var _ = require('underscore')

var makeFileList = require('../src/makeFileList')

describe('makeFileList', function() {
	var DIR = path.join(__dirname, 'makeFileListTest')
	var DEPS = {
		index: ['block1', 'block2']
	}

	it('creates fileList from levelsTree', function() {
		var fileList = makeFileList(DIR, DEPS, '.css')
		var normalized = _.map(fileList.index, function(file) { return path.normalize(file) })
		assert.deepEqual(normalized, [
			path.join(DIR, '0', 'block1.css'),
			path.join(DIR, '1', 'block2.css')
		])
	})

})