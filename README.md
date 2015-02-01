# broccoli-bem

This is a plugin for building BEM projects with Broccoli.

## BEM

BEM — Block Element Modifier is a methodology,
that helps you to achieve reusable components and code sharing in the front-end.

Read more here:
http://getbem.com/introduction/

Or here:
https://bem.info/

## Features

* Simple BEM implementation, read more on the 
	[Projects structure](https://github.com/sunflowerdeath/broccoli-bem/blob/master/docs/projects.md).
* Includes set of basic technologies: `js, css, handlebars, img`;
	pre- and postprocessors: `scss, autoprefixer, es6`.
	([List of technologies](https://github.com/sunflowerdeath/broccoli-bem/blob/master/docs/techs.md))
* Sourcemaps in debug mode and minifying in production mode.
* It is possible to plug-in additional techs as separate modules.
* Fast rebuilds with caching.
* Development server and LiveReload as built-in to Broccoli feature.

## Usage

First you need to install broccoli and broccoli-bem:

```
npm install broccoli
npm install --global broccoli-cli
npm install broccoli-bem
```

Then you need to create `Brocfile.js` and set up build:

```
var bem = require('broccoli-bem')

module.exports = bem({
  blockName: 'index',
  levels: ['path/to/level']
})
```

Then use command `broccoli serve` to run development server,
or `broccoli build dest-dir` to build files to directory.

## Documentation

* [Projects structure](https://github.com/sunflowerdeath/broccoli-bem/blob/master/docs/projects.md)
* [API](https://github.com/sunflowerdeath/broccoli-bem/blob/master/docs/api.md)
* [List of technologies](https://github.com/sunflowerdeath/broccoli-bem/blob/master/docs/techs.md)

## License

Public domain, see the `LICENCE.md` file.

`vendor` directory contains third-party software and copies of their license files.
