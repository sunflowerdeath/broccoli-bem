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

Suffixes: `js`

It concatenates script files.

Options:

* **debug** &ndash; When `true`, it builds files with sourcemaps
and set global variable `var DEBUG = true`.
When `false`, it minifies scripts with UglifyJS.

### es6

Suffixes: `es6.js`

Preprocessor for js technology, that compiles ES6 to ES5 with 
[6to5](https://6to5.org/).

Also it automatically adds nessecary browser polyfill and runtime.


# Images

### img

It copies images and fonts to separate directory.

Suffixes: `png, jpg, jpeg, ttf, woff, eot, svg`

### webfont

Suffixes: `icon.svg`

Technology that creates webfont from SVG icons.

It also generates SCSS-mixin that inserts styles of icons:

```
@import 'webfont.mix';

.myicon {
  @include webfont-icon('myicon');
}
```

### sprite

Not implemented yet

Suffixes: `sprite.png`


# Templates

## handlebarsPage

Suffixes: `page.hbs, part.page.hbs`

It renders handlebars templates to static html pages.

Render context contains object `files` with lists of built files
of every suffix (`js, css, ie8.css, ie9.css`).
