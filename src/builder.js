var _ = require('underscore')
var mergeTrees = require('broccoli-merge-trees')

var makeDeps = require('./makeDeps')
var DeclReader = require('./declReader')
var LevelsReader = require('./levelsReader')

var DEFAULT_OPTIONS = {
	deployPath: '/deploy',
	techs: ['js', 'scss', 'css', 'autoprefixer'],
	levels: ['blocks'],
	techModules: [
		require('./techs')
	]
}

function moveNextTechsToPrev(techs) {
	for (var techName in techs) {
		var tech = techs[techName]
		tech.prevTechs = tech.prevTechs || []
	}

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

/** Takes list of techs, runs them, merges results and returns it. */
function buildTechs(options, techs, deps) {
	var usedTechs = _.pick(techs, options.techs)
	var results = runTechs(options.techs, options, usedTechs, deps)
	var withoutPreprocessors = _.filter(results, function(result, tech) {
		if (!techs[tech].preprocessor) return result
	})
	return mergeTrees(withoutPreprocessors, {overwrite: true})
}

/** Runs techs and their dependent techs recursively. */
function runTechs(techsList, options, techs, deps, results) {
	if (results === undefined) results = {}

	for (var i in techsList) {
		var techName = techsList[i]
		var tech = techs[techName]

		if (!tech) continue
		if (results[techName]) continue
		if (tech._mark) throw('Cycle on tech "' + techName + '"')

		tech._mark = true
		runTechs(tech.prevTechs, options, techs, deps, results)

		var sourceTrees = _.values(_.pick(results, tech.prevTechs))
		if (tech.suffixes) {
			sourceTrees.push(new LevelsReader(options.levels, deps, tech.suffixes))
		}
		var mergedSourceTree = mergeTrees(sourceTrees, {overwrite: true})
		var result = new tech.Tree(mergedSourceTree, deps, options)

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

function Builder(options) {
	if (!(this instanceof Builder)) return new Builder(options)
	this.options = _.extend({}, DEFAULT_OPTIONS, options)
	this.techs = _.extend.apply(_, this.options.techModules)

	if (!this.options.blockName) {
		throw new Error('[broccoli-bem] Option "blockName" is required')
	}
	if (!Array.isArray(this.options.levels)) {
		throw new Error('[broccoli-bem] Option "levels" must be an array')
	}
	var unknown = _.difference(this.options.techs, _.keys(this.techs))
	if (unknown.length) {
		throw new Error('[broccoli-bem] Unknown techs: ' + unknown.join())
	}

	this.techs = moveNextTechsToPrev(this.techs)
	for (var i in this.techs) {
		var tech = this.techs[i]
		if (tech.changeOptions) this.options = tech.changeOptions(options)
	}
}

Builder.prototype.read = function(readTree) {
	var reader = new DeclReader(this.options.levels)
	var deps = makeDeps(this.options.blockName, reader)
	for (var i in this.techs) {
		var tech = this.techs[i]
		if (tech.changeDeps) deps = tech.changeDeps(deps, reader)
	}
	if (!_.isEqual(this.cachedDeps, deps)) {
		this.cachedDeps = deps
		this.cachedTree = buildTechs(this.options, this.techs, deps)
	}
	return readTree(this.cachedTree)
}

Builder.prototype.cleanup = function() {}

module.exports = Builder
