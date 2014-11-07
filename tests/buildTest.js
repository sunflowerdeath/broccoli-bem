var assert = require('assert')
var path = require('path')
var _ = require('underscore')

var build = require('../src/build')

xdescribe('build', function() {

	it('hz', function(done) {
		build({
			declName: 'block',
			levels: [
				path.join(__dirname, 'buildTest/level')
			]
		})
			.pipe(gulp.dest('deploy'))
			.pipe(streamUtils.bufferStream(function(files) {
				console.log('DEST FILES')
				files.map(function(f) { console.log(f.path) })
				return files
			}))
	})

})