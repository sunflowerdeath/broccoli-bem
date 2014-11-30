var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')

var makeDeps = require('./makeDeps')
var DeclReader = require('./DeclReader')
var LevelsReader = require('./LevelsReader')

var DEFAULT_CONFIG = {
	deployPath: '/deploy',
	techs: ['js', 'scss', 'css'],
	levels: ['blocks'],
	techModules: [
		{
			js: require('./techs/js'),
			css: require('./techs/css'),
			scss: require('./techs/scss')
		}
	]
}

function loadTechs(techModules) {
	var techs = _.extend.apply(_, techModules)

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
	return mergeTrees(withoutPreprocessors, {overwrite: true})
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
		if (tech.suffixes) {
			for (var i in tech.suffixes) {
				sourceTrees.push(new LevelsReader(config.levels, deps, tech.suffixes[i]))
			}
		}
		var mergedSourceTree = mergeTrees(sourceTrees, {overwrite: true})
		var result = new tech.Tree(mergedSourceTree, deps, config)

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
	this.techs = loadTechs(this.config.techModules)

	if (!this.config.blockName) {
		throw new Error('[broccoli-bem] Option "blockName" is not specified.')
	}

	var unknown = _.difference(this.config.techs, _.keys(this.techs))
	if (unknown.length) {
		throw new Error('[broccoli-bem] Unknown techs: ' + unknown.join() + '.')
	}

	for (var i in this.techs) {
		var tech = this.techs[i]
		if (tech.changeConfig) this.config = tech.changeConfig(config)
	}
}

Builder.prototype.read = function(readTree) {
	var reader = new DeclReader(this.config.levels)
	var deps = makeDeps(this.config.blockName, reader)
	for (var i in this.techs) {
		var tech = this.techs[i]
		if (tech.changeDeps) deps = tech.changeDeps(deps, reader)
	}
	var tree = buildTechs(this.config, this.techs, deps)
	return readTree(tree)
}

Builder.prototype.cleanup = function() {}

module.exports = Builder
