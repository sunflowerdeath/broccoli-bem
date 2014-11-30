API
===

Builder(options)
----------------

Creates instance of builder plugin.

###options.blockName

Type: `string`

Name of block to build.

###options.deployPath

Type: `string`

Default: `/deploy`

Path to built files in browser.

###options.levels

Type: `array.<string>`

Default: `['/blocks']`

Paths of levels directories.

###options.techs

Type: `array.<string>`

Default: `[TODO]`

List of used technologies.

###options.techModules

Type: `array.<object>`

Default: `[TODO]`

Modules with technologies builders.

Example:
```js
techsModules: [
  require('broccoli-bem-build-techs'),
  require('broccoli-bem-test-techs')
]
```

Technology builders
-------------------

Technology builder is an object with following properties:

###Tree

Type: `function(levelsTree, deps, options)`

Broccoli plugin that builds technology files.
It takes following arguments:

**levelsTree** &mdash; Input tree with tech files from levels.

**deps** &mdash; Object with dependencies.

**options** &mdash; Builder's options.

To match tech files with dependencies you can use function 
`findDepsFiles(levelsDir, deps, suffix)`.
It returns object with lists of files for each module.
Filepaths are relative to levelsDir.

Example:
```js
var MyTech = function() {
  this.levelsTree = levelsTree
  this.deps = deps
  this.config = config
}

MyTech.prototype.read = function(readTree) {
  var self = this
  return readTree(this.levelsTree).then(function(levelsDir) {
    var depsFiles = findDepsFiles(levelsDir, self.deps, 'mytech')
    _.map(depsFiles, function(files, moduleName) {
      //here code that builds files of module 'moduleName'.
    })
  })
}

MyTech.prototype.cleanup = function() {}
```

###suffixes

Type: `array`

List of tech files suffixes.

Example: `['js', 'css']`

###preprocessor

Type: `boolean`

Default: `false`

Is the technology a preprocessor.<br>
Results of preprocessors are not included in the final build result.

###postprocessor

Type: `boolean`

Default: `false`

Is the technology a postprocessor.<br>
Results of postprocessors are replaced by results of processed technologies.

###prevTechs

Type: `array`

Default: `[]`

List of technologies that are built before current.<br>
LevelsTree of current technology contains its own files and files received as a result of building its previous technologies.

###nextTechs

Type: `array`

Default: `[]`

List of technologies that are built after current.<br>
LevelsTrees of next technologies will contain result of building current technology.

###changeOptions

Type: `function(options)`

Function that can change builder's options.
