var assert = require('assert')
var path = require('path')
var _ = require('underscore')

var findTechFiles = require('../src/findTechFiles')

describe('findTechFiles', function() {
	var DIR = path.join(__dirname, 'findTechFilesTest')

	var SIMPLE_DIR = path.join(DIR, 'simple')
	var NESTED_DIR = path.join(DIR, 'nested')
	var DOTS_DIR = path.join(DIR, 'dots')
	
	function findFiles(dir) {
		return findTechFiles(dir, '.css').map(function(file) {
			return path.normalize(file)
		})
	}
	
	it('finds files with suffix in dir', function() {
		var files = findFiles(SIMPLE_DIR)
		assert.deepEqual(files, [path.join(SIMPLE_DIR, 'file.css')])
	})
	
	it('finds files in nested dirs', function() {
		var files = findFiles(NESTED_DIR)
		assert.deepEqual(files, [path.join(NESTED_DIR, 'subdir/file.css')])
	})
	
	it('does not find files with dots in name except versions at the end', function() {
		var files = findFiles(DOTS_DIR)
		assert.deepEqual(files, [path.join(DOTS_DIR, 'file.1.0.9.css')])
	})
	
	xit('doesnot find files in excluded dirs', function() {
	})
})