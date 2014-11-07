var sass = require('gulp-sass')
var _ = require('underscore')

var techUtils = require('./techUtils')
var streamUtils = require('./streamUtils')

var scss = {
	preprocessor: true,
	nextTechs: ['css'],
	src: function(deps, config) {
		return techUtils.findTechFilesBySuffix('.scss', config.levels)
	},
	build: function(deps, config) {
		return streamUtils.bufferStream(function(files) {
			console.log(files)
			var fileList = techUtils.makeFileList(files, deps, '.scss', config.levels)
			return streamUtils.streamArray(_.flatten(_.values(fileList)))
				.pipe(sass({imagePath: '../images'}))
		}, {replaceStream: true})
	}
}

module.exports = scss