var path = require('path')
var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')

var makeDeps = require('./makeDeps')
var DeclReader = require('./DeclReader')

var DEFAULT_CONFIG = {
	deployDir: 'deploy',
	deployPath: '/deploy',
	techs: ['js', 'scss', 'css', 'img'],
	levels: ['blocks'],
	env: 'prod'
}

var autoprefixer = {
	postprocessor: true,
	prevTechs: ['css'],
	build: function(config) {
		//
	}
}

function loadTechs() {
	var techs = {
		css: require('.techBuilders/css')
		//scss: require('./scss'),
		//autoprefixer: autoprefixer
	}
	
	for (var techName in techs) {
		var tech = techs[techName]
		tech.prevTechs = tech.prevTechs || []
	}

	//move nextTechs to prevTechs
	for (var techName in techs) {
		var tech = techs[techName]
		var nextTechs = tech.nextTechs || []
		
		for (var i in nextTechs) {
			var nextTechName = nextTechs[i]
			var nextTech = techs[nextTechName]
			if (!nextTech.prevTechs) nextTech.prevTechs = []
			nextTech.prevTechs.push(techName)
		}
	}
	
	return techs
}

function buildTechs(config, techs, deps) {
	var usedTechs = _.pick(techs, config.techs)
	var results = runTechs(config.techs, config, usedTechs, deps)
	var withoutPreprocessors = _.filter(results, function(result, tech) {
		if (!techs[tech].preprocessor) return result
	})
	return mergeTrees(withoutPreprocessors)
}


function runTechs(techsList, config, techs, deps, results) {
	if (results === undefined) results = {}

	for (var i in techsList) {
		var techName = techsList[i]
		var tech = techs[techName]
		
		if (!tech) continue
		if (results[techName]) continue
		if (tech._mark) throw('Cycle on tech "' + techName + '"')
		
		tech._mark = true
		runTechs(tech.prevTechs, config, techs, deps, results)

		var sourceTrees = _.values(_.pick(results, tech.prevTechs))
		if (tech.Picker) sourceTrees.push(tech.Picker(deps, config))
		var mergedSourceTree = mergeTrees(sourceTrees)
		var result = tech.Builder(mergedSourceTree, deps, config)

		if (tech.postprocessor) {
			var processedTechName = tech.prevTechs[0]
			results[processedTechName] = result
		} else {
			results[techName] = result
		}
		tech._mark = false
	}
	
	return results
}

function Builder(config) {
	if (!(this instanceof Builder)) return new Builder(config)
	this.config = _.extend({}, DEFAULT_CONFIG, config)
	
	var cwd = process.cwd()
	for (var i in this.config.levels) {
		this.config.levels[i] = path.join(cwd, this.config.levels[i])
	}
}

Builder.prototype.read = function(readTree) {
	var declName = this.config.declName
	if (!declName) {
		throw new Error('bem.build', 'Option "declName" is not specified')
	}

	var techs = loadTechs()

	//check that techs in config are in techs

	//preprocessors can have only builders nextTechs 
	//postprocessors can have only one builder prevTech
	//builders can have prev and next techs to other builders

	var reader = new DeclReader(this.config.levels)
	var deps = makeDeps(declName, reader)
	var tree = buildTechs(this.config, techs, deps)
	return readTree(tree)
}

Builder.prototype.cleanup = function() {}

module.exports = Builder