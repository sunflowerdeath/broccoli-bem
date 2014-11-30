List of technologies
====================

Styles
------

###css

Suffixes: `css, ie8.css, ie9.css`

It concatenates style files of modules.
Styles for ie8 and ie9 are built separately.

###scss

Preprocessor for css technology. It uses libsass compiler.

Suffixes: `scss, ie8.scss, ie9.scss, mix.scss`

###autoprefixer

Postprocessor for css technology.

Scripts
-------

###js

It concatenates script files of modules.
Styles for ie8 and ie9 are built separately.

Suffixes: `js, ie8.js, ie9.js`

Options:

**debug** &mdash; When `true`, it builds files with sourcemaps and set global var `DEBUG = true`.
When `false`, it compresses scripts with uglifyjs.

Images
------

###img

It copies image and font files to separate directory.

Suffixes: `png, jpg, jpeg, ttf, woff, eot, svg`

###sprite

Suffixes: `sprite.png`

###iconfont

Suffixes: `icon.svg`
