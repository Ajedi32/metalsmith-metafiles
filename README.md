# metalsmith-metafiles [![Build Status](https://travis-ci.org/Ajedi32/metalsmith-metafiles.svg)](https://travis-ci.org/Ajedi32/metalsmith-metafiles)

A [Metalsmith][metalsmith] plugin to read file metadata from separate files (as
an alternative to frontmatter).

For example, when using this plugin you could add metadata to a file named
`index.html` by creating a file named `index.html.meta.json` and putting your
metadata in that file.

Why choose this method over frontmatter? While frontmatter is a convenient way
to set metadata in your files, it can cause problems with syntax highlighters,
[linters](https://github.com/jekyll/jekyll/issues/3408), and other tools which
expect your source files to contain only valid syntax from the language they are
written in. (Frontmatter isn't valid CSS, HTML, JavaScript, etc.) Putting your
metadata in separate files eliminates these problems.

Currently, metalsmith-metafiles supports the JSON, YAML, CSON, and TOML formats,
among others. (See the [parsers](#parsers) section below for details.)

## Installation

    npm install --save metalsmith-metafiles

## CLI Usage

After installing metalsmith-metafiles, simply add the `metalsmith-metafiles` key
to the plugins in your `metalsmith.json` file. Be sure to include it *before*
any plugins which need to use the metadata in your metadata files. Generally
speaking, this means that metalsmith-metafiles should be the first plugin in the
list.

```javascript
{
  "frontmatter": false, // Optionally disable frontmatter parsing
  "plugins": {
    "metalsmith-metafiles": {
      // Options here
    },
    // Other plugins...
  }
}
```

## JavaScript Usage

After installing metalsmith-metafiles, you can require `metalsmith-metafiles` in
your code, then call the exported value to initialize the plugin and pass the
result to `Metalsmith.use` (just as you would with any other Metalsmith plugin).
Again, be sure to use metalsmith-metafiles *before* any plugins which need to
use the metadata defined your metadata files. Generally speaking, this means
that metalsmith-metafiles should be the first plugin in the list.

```javascript
var metafiles = require('metalsmith-metafiles');

Metalsmith(__dirname)
  .frontmatter(false) // Optionally disable frontmatter parsing
  .use(metafiles({
    // Options here
  }))
  .use(/* Other plugins... */)
  .build(function(err) {
    if (err) throw err;
  });
```

## Options

metalsmith-metafiles supports the following configuration options:

### `deleteMetaFiles`

Type: `Boolean`

Default: `true`

Determines whether metadata files are removed from the generated site.

For example, setting this option to false would result in your `.meta.json`
files being put in your destination directory when you build the site. (Unless
of course they're removed by some other plugin.)

### `postfix`

Type: `String`

Default: `.meta`

The postfix added to filenames to indicate they are metadata files. This doesn't
include the file extension, only the extra text before the extension.

For example, setting this option to `.m` would allow you to use `*.m.json` files
to store file metadata instead of `*.meta.json` files. Values without a `.` in
them are also allowed. For example, `meta` would result in `*meta.json` being
used to store metadata.

### `prefix`

Type: `String`

Default: `""`

The prefix added to filenames to indicate they are metadata files.

For example, setting this option to `"m-"`, in combination with the default
postfix value of `".meta"`, would result in `m-*.meta.json` files being used to
store metadata.

### `onMissingMainFile`

Type: `String`

Default: `"throw"`

Controls what happens when metalsmith-metafiles encounters a metadata file with
no corresponding main file. (E.g. when `a.meta.json` exists, but not `a`.)

The possible values are:

* `"throw"` - Throws an error when a metadata file with no corresponding main
  file is encountered (default)
* `"ignore"` - Silently ignores metadata files with no corresponding main file
* `"delete"` - Deletes metadata files with no corresponding main file

### `parsers`

Type: `Object`

Default: `{".json": true}`

An object containing configuration details for the parsers used for different
metadata formats.

Each key should be an extension used by a parser (including the leading '.'),
with a value of either a boolean, a string, a function, or an object.

If you use a boolean (`true` or `false`) as the value, that simply determines
whether or not you want the default parser for that extension to be enabled.
(E.g. `{".yaml": true}` enables the `js-yaml` parser for `*.meta.yaml` files,
and `{".json": false}` disables parsing JSON metadata files.)

If you use a string for the value, you can also choose a specific built-in
parsers to be assigned to the given file extension. The string must correspond
to the name of the built-in parser. (E.g. `{".custom-yaml": 'js-yaml',
'.j': 'JSON.parse'}`)

Using a function for the value (which can only be done using the JavaScript API,
not the CLI) allows you to assign a custom parser to a file extension. The
function is passed the contents of the file (as a Buffer) as its first argument,
and an object with a `path` property assigned to the path of the file as its
second argument. The function should return an object containing the metadata
properties contained within the metadata file it was passed.

Using an object for the value allows for fine-grained control over the config
settings used for the given parser. The object can contain any of the config
options for metalsmith-metafiles mentioned above (except for `parsers` of
course), and overrides the global settings for the given parser. Additionally,
the object can contain (or must in the case of a file extension without a
default parser) a `parser` property, which may be either a named parser or a
function (both of which work as described in the paragraphs above).

Currently, the following named parsers are supported:

* `"JSON.parse"` - Exactly what it sounds like
* `"js-yaml"` - An npm package which parses YAML formatted data files. To use
  this, you must have `js-yaml` installed. (Preferably as a dependency of your
  project.)
* `"eval"` - Executes the file as JavaScript and returns the result of the last
  expression
* `"eval-wrapped"` - Like `eval`, but wraps the file's code in an object before
  evaluating it. (E.g. `(function() {return {...}; })()`)
* `"require"` - Requires the file as a Node module and returns the module's
  exports
* `"coffee-script"` - Executes the file as CoffeeScript using the
  `coffee-script` package, and returns the result of the last expression. To use
  this, you must have `coffee-script` installed. (Preferably as a dependency of
  your project.)
* `"toml"` - Parses TOML formatted data files using the `toml` npm package. To
  use this, you must have `toml` installed. (Preferably as a dependency of your
  project.)

The following file extensions are assigned default parsers when you enable them
with `{".extension": true}` (only `.json` is enabled by default):

* `.json` - Uses `"JSON.parse"` (enabled by default)
* `.yaml` - Uses `"js-yaml"`
* `.yml` - Uses `"js-yaml"`
* `.js` - Uses `"require"`
* `.coffee` - Uses `"coffee-script"`
* `.cson` - Uses `"coffee-script"`
* `.toml` - Uses `"toml"`

CLI config example:

```javascript
{
  "frontmatter": false,
  "plugins": {
    "metalsmith-metafiles": {
      "parsers": {
        ".json": false, // Disable using JSON metadata files
        ".yaml": true, // Enable using YAML metadata files
        ".y": "js-yaml", // Treat *.meta.y files as YAML metadata
        '.custom': {
          parser: "js-yaml",
          prefix: 'm-',
        }
      }
    },
    // Other plugins...
  }
}
```

JavaScript example:

```javascript
var metafiles = require('metalsmith-metafiles');

Metalsmith(__dirname)
  .frontmatter(false)
  .use(metafiles({
    parsers: {
      ".json": false, // Disable using JSON metadata files
      ".yaml": true, // Enable using YAML metadata files
      ".y": "js-yaml", // Treat *.meta.y files as YAML metadata
      ".js": function(content, options) { // Custom parser
        // Print the path to the file
        console.log("Parsing file: " + options.path + "!");

        // Execute the file and return the result
        return eval(content.toString());
      },
      '.custom': {
        parser: "js-yaml",
        prefix: 'm-',
      },
    }
  }))
  .use(/* Other plugins... */)
  .build(function(err) {
    if (err) throw err;
  });
```

## License

MIT (See [LICENSE](./LICENSE) file)

[metalsmith]: https://github.com/segmentio/metalsmith
