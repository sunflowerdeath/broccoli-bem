BEM
===

BEM — Block Element Modifier is a methodology, that helps you to achieve reusable components and code sharing in the front-end.

Read more here:
http://getbem.com/introduction/

Or here:
https://bem.info/

Filesystem organization
=======================

###Levels

Level is a directory with blocks and its elements and modifiers.
You can use more than one level at the same time.

Blocks, elements and modifiers on levels have implementations in different technologies
&mdash; files named according to BEM-naming with technology suffix.

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
