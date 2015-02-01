# List of technologies

## Styles

### css

Suffixes: `css, ie8.css, ie9.css`

It concatenates style files.
Styles for IE8 and IE9 are built separately.

Options:

* **debug** &ndash; When `true`, it builds files with sourcemaps.
When `false`, it minifies styles with clean-css.

### scss

Suffixes: `scss, ie8.scss, ie9.scss, mix.scss`

Preprocessor for css technology.
It uses [node-sass](https://github.com/sass/node-sass).

Mixins should be written in separate files with suffix `mix.scss`,
because build result can consist of more than one bundle,
and mixins should be available in all bundles.

Mixins are included by name, without path:

```scss
@include 'mixin.mix';
```

### autoprefixer

Postprocessor for css technology.


## Scripts

### js

It concatenates script files.
Styles for IE8 and IE9 are built separately.

Suffixes: `js, ie8.js, ie9.js`

Options:

* **debug** &ndash; When `true`, it builds files with sourcemaps
and set global variable `var DEBUG = true`.
When `false`, it minifies scripts with UglifyJS.

### es6

Preprocessor for js technology, that compiles ES6 to ES5.

_TODO polyfill_

Suffixes: `es6.js`


# Images

### img

It copies images and fonts to separate directory.

Suffixes: `png, jpg, jpeg, ttf, woff, eot, svg`

### sprite

Not implemented

Suffixes: `sprite.png`

### webfont

Suffixes: `icon.svg`

Technology that creates webfont from SVG icons.

It also creates SCSS mixin to generate styles of icons:

```
@import 'webfont.mix';

.myicon {
	@include webfont-icon('myicon');
}
```


# Page

_TODO_
