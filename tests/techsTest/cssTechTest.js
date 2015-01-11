var assert = require('assert')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')

var Builder = require('../../src/builder')

describe('css tech', function() {
	var DIR = path.join(__dirname, 'cssTechTest')
	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
	})
	
	var checkOccurence = function(str, items) {
		for (var i in items) {
			if (str.indexOf(items[i]) === -1) return false
		}
		return true
	}

	it('builds css to concatenated files', function() {
		var level = path.join(DIR, 'blocks')
		var bem = Builder({
			blockName: 'index',
			techs: ['css'],
			levels: [level]
		})

		builder = new broccoli.Builder(bem)
		return builder.build().then(function(result) {
			var dir = result.directory
			var index = fs.readFileSync(path.join(dir, 'styles/index.css'), 'utf8')
			var ie8 = fs.readFileSync(path.join(dir, 'styles/index.ie8.css'), 'utf8')
			var module = fs.readFileSync(path.join(dir, 'styles/module.css'), 'utf8')

			assert(checkOccurence(index, ['block', 'block__elem', 'index', 'index__elem']))
			assert(checkOccurence(ie8, ['indexie8']), 'browser specific code is built separately')
			assert(checkOccurence(module, ['module']), 'modules are built separately')
		})
	})
})
