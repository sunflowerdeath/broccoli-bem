Intro
=====

BEM
---

BEM — Block Element Modifier is a methodology, that helps you to achieve reusable components and code sharing in the front-end.

Read more here:
http://getbem.com/introduction/

Or here:
https://bem.info/

Filesystem organization
-----------------------

BEM-projects require special filesystem organization to allow automating building process.

broccoli-bem uses following conventions:

###Levels

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

###Declarations

To describe dependencies of blocks there are special files called declarations of dependencies.
Every block, element and modifier can have own declaration. 
They contain list of dependencies to current block's items and to other blocks and their items.
Declarations files have extension `.decl.json`.

Example:
```json
//button.decl.json
{
  "items": [
    "button__elem"
  ],
  "blocks": [
    {
      "name": "block",
      "items": [
        "block__elem",
        "block_mod"
      ]
    }
  ]
}
```

###Modules

Declaration can specify that block should be built as separate module.
Modules are useful for separating common part of multiple pages or
for deferring loading of some code.

There are two types of modules &mdash; static and deferred.
Static modules are always loaded to page, deferred modules are loaded only when needed.
By default all blocks are built to single static module.

If block is built as separate module, it and its dependencies will no longer be included into next
modules.

To build block as module you need to add to declaration `"module": true`.<br>
For deferred module &mdash; `"module": true, "deferred": true`.
