Javascript Style Guide
----------------------

###Indentation

Use tabs size of 2 spaces.

If file have only one top level block, its content is not indented,
but it should be separated by blank lines.

```js
!function() {

window.something = 'something'

}()
```

When declaring several variables in one place only one `var` is used.
Variable names are aligned under each other:

```js
var a = 123,
    b = {
      a: 1
    }
```

###Semicolons

Not used, except in the following situations:

* `for (;;)` loops
* Empty loops `while (something);`
* `case 'foo': doSomething(); break`
* In front of symbols `(`, `[`, `-`, `+` and `/` at the start of the line.
This prevents expressions from being interpreted as a continuation of the previous line
(function call, property access, etc).

###Curly braces

Curly braces are on the same line as the thing that requires them.

When braces are optional, do not use them, if the entire expression is on the same line.
If the expression is on the next line, braces are required.

```js
if (condition) doSomething()
if (condition) {
  doSomething()
}
```

###Names

* `lowerCamelCase` for variables, methods and namespaces.
* `UpperCamelCase` for constructors.
* `CAPS_CASE` for constants.

###Whitespace

Do not use space:

* after opening and before closing round, square and curly brackets
* before round brackets in function calls and definitions
* before colons and commas

Use single space to separate all other keywords and binary operators.

```js
var arr = [1, 2, 3]
var obj = {a: 1, b: 2, c: 3}
var fn = function(a, b) {
  return a + b
}
if (arr[0] == obj.a) {
  fn(5, 6)
}
```

###Quotes

Use single quotes (`'`) for strings.

###Line length

Limit line lengths to 100 characters.
