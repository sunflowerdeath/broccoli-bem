var assert = require('assert')
var path = require('path')
var _ = require('underscore')

var findDepsFiles = require('../src/findDepsFiles')

describe('findDepsFiles', function() {
	var DIR = path.join(__dirname, 'findDepsFilesTest')
	var DEPS = {
		index: ['block1', 'block2']
	}

	it('finds deps files from levelsTree', function() {
		var depsFiles = findDepsFiles(DIR, DEPS, 'css')
		assert.deepEqual(depsFiles.index, ['0/block1.css', '1/block2.css'])
	})

})
