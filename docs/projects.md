# Projects structure conventions

BEM-projects require special filesystem organization to allow automating building process.

Broccoli-bem uses following conventions:

## Levels

Level is a directory with blocks and its elements and modifiers.
You can use more than one level at the same time.

Blocks, elements and modifiers on levels have implementations in different technologies
&mdash; files named according to BEM-naming with suffix of technology.

For example: `button.js, button_color_red.png, button__icon.ie8.css, dropdown__menu.css`

Directory structure inside levels doesn't matter, because file names are globally unique.
But usually blocks have separate folders and optionally subfolders for elements and modifiers.

Example:

```
level/
  block/
    block.css
    block.js
    __elem/
      block__elem.css
      block__elem.js
```


## Dependencies

To describe dependencies of blocks there are special files called declarations of dependencies.
Every block, element and modifier can have own declaration. 
They contain list of dependencies to current block's items and to other blocks and their items.
Declarations files have extension `.deps.json`.

Example:

```js
{
  "blocks": [
    {
      "name": "anotherBlock",
      "items": [
        "anotherBlock__elem",
        "anotherBlock_mod"
      ]
    }
  ],
  "items": [
    "block__elem",
    "block_mod_val"
  ]
}
```

Build order is like this:

* Other blocks and their elements and modifiers
* Current block (You don't need to specify this dependency)
* Elements and modifiers of the current block


## Bundles

Declaration can specify that block should be built as separate bundle.
Bundles are useful for separating common part of multiple pages or
for deferring loading of some code.

There are two types of bundles &ndash; static and deferred.
Static bundles are always loaded to page, deferred bundles are loaded only when needed.
By default all blocks are built to single static bundle.

If block is built as separate bundle, it and its dependencies will no longer be included
into next bundles.

To build block as bundle you need to add to declaration `"bundle": true`.<br>
For deferred bundle &ndash; `"bundle": true, "deferred": true`.
