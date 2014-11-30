var path = require('path')

function changeExt(file, newExt, oldExt) {
	if (oldExt === undefined) oldExt = path.extname(file).slice(1)
	return path.join(path.dirname(file), path.basename(file, '.' + oldExt) + '.' + newExt)
}

module.exports = changeExt
