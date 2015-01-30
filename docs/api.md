# API

## Builder(options)

Creates instance of builder plugin.

### options.blockName

Type: `string`

Name of block to build.

### options.deployPath

Type: `string`

Default: `/deploy`

Path to built files in browser.

### options.levels

Type: `array.<string>`

Default: `['/blocks']`

Paths of levels directories.

### options.techs

Type: `array.<string>`

Default: `[TODO]`

List of used technologies.

### options.techModules

Type: `array.<object>`

Default: `[TODO]`

Array of modules with technology builders.

Example:

```js
techsModules: [
  require('broccoli-bem-build-techs'),
  require('broccoli-bem-test-techs')
]
```


## Technology builders

This is a description of how to add new technlogies.

Technology builder is an object with the following properties:

### Tree

Type: `function(levelsTree, deps, options)`

Broccoli plugin that builds technology files.
It takes the following arguments:

* **levelsTree** &ndash; Input tree with tech's files from the levels.
* **deps** &ndash; Object with dependencies.
* **options** &ndash; Builder's options.

To find files of dependencies you can use function `makeDepsGlobs(deps, suffix, flatten)`.
<br>
It returns an object with lists of globs for each bundle.
Globs are relative to the levelsTree.
<br>
Then you can pass this globs to some plugin supporting globs, or find files with e.g.
[dirmatch](https://github.com/sunflowerdeath/dirmatch) and processes them.

Example:

```js
var MyTech = function(levelsTree, deps, options) {
  this.levelsTree = levelsTree
  this.deps = deps
  this.options = options
}

MyTech.prototype.read = function(readTree) {
  var depsGlobs = makeDepsGlobs(this.deps, 'suffix')
  return readTree(this.levelsTree).then(function(levelsDir) {
    _.map(depsGlobs, function(files, bundleName) {
      // Here code that builds files of bundle 'bundleName'.
    })
  })
}

MyTech.prototype.cleanup = function() {}
```

### suffixes

Type: `array`

List of tech files suffixes.

Example: `['js', 'css']`

### preprocessor

Type: `boolean`

Default: `false`

Is the technology a preprocessor.<br>
Results of preprocessors are not included in the final build result.

### postprocessor

Type: `boolean`

Default: `false`

Is the technology a postprocessor.<br>
Results of postprocessors are replaced by results of processed technologies.

### prevTechs

Type: `array`

Default: `[]`

List of technologies that are built before current.<br>
LevelsTree of current technology contains its own files and files received as a result of building its previous technologies.

### nextTechs

Type: `array`

Default: `[]`

List of technologies that are built after current.<br>
LevelsTrees of next technologies will contain result of building current technology.

### changeOptions

Type: `function(options)`

Function that can change builder's options.

### changeDeps

Type: `function(deps, options)`

Function that can change deps.
