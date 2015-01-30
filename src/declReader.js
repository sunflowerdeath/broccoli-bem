var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var glob = require('glob')

var DeclReader = function(levels) {
	this.levels = levels
	this.decls = {}
	this.files = this.findDeclFiles()
}

/** Finds declarations files on levels. */
DeclReader.prototype.findDeclFiles = function() {
	var result = []

	for (var i in this.levels) {
		var declPattern = path.join(this.levels[i].trim(), '**/*.decl.json')
		var files = glob.sync(declPattern)
		result.push(files)
	}

	var filesList = _.flatten(result)
	return this.groupDeclFiles(filesList)
}

DeclReader.prototype.groupDeclFiles = function(files) {
	var map = {}

	for (var i in files) {
		var filename = files[i]
		var blockname = path.basename(filename, '.decl.json')

		if (!map[blockname]) map[blockname] = []
		map[blockname].push(filename)
	}

	return map
}

/** Traverses declaration and all its dependencies recursively. */
DeclReader.prototype.traverse = function(name, callback, traversed) {
	if (traversed === undefined) traversed = []

	if (traversed.indexOf(name) !== -1) return

	this.readDeclFromFiles(name)
	var decl = this.decls[name]
	var newDecl = callback(name, decl)
	if (newDecl) decl = newDecl

	for (var i in decl.blocks) {
		var block = decl.blocks[i]
		this.traverse(block.name, callback, traversed)

		for (var j in block.items) {
			this.traverse(block.items[j], callback, traversed)
		}
	}
	
	for (i in decl.items) {
		this.traverse(decl.items[i], callback, traversed)
	}

	traversed.push(name)
}

DeclReader.prototype.changeDecl = function(name, callback) {
	this.readDeclFromFiles(name)
	this.decls[name] = callback(this.decls[name])
}

/** Reads, parses and stores declaration, if it is not already stored */
DeclReader.prototype.readDeclFromFiles = function(name) {
	if (this.decls[name]) return

	var decl = {items: [], blocks: []}
	var files = this.files[name]

	for (var i in files) {
		var declPath = files[i]
		if (!fs.existsSync(declPath)) continue;
		var file = fs.readFileSync(declPath, 'utf-8')
		file = file.replace(/^\uFEFF/, '') //utf BOM

		try {
			var json = JSON.parse(file)
			this.mergeDecls(decl, json)
		} catch(e) {
			throw new Error('Can\'t parse JSON in file "' + declPath + '"')
		}
	}

	this.decls[name] = decl
}

DeclReader.prototype.mergeDecls = function(target, source) {
	if (source.items) target.items = _.union(target.items, source.items)

	if (source.blocks) {
		for (var i in source.blocks) {
			var block = source.blocks[i]
			var blockName = block.name
			if (!block.items) block.items = []

			var targetBlock = _.findWhere(target.blocks, {name: blockName})
			if (targetBlock) {
				targetBlock.items = _.union(targetBlock.items, block.items)
			} else {
				target.blocks.push(block)
			}
		}
	}

	target.bundle = target.bundle || source.bundle
	target.deferred = target.deferred || source.deferred

	var handled = ['items', 'blocks', 'bundle', 'deferred']
	_.each(source, function(val, key) {
		if (!_.contains(handled, key)) target[key] = val
	})
}

module.exports = DeclReader
