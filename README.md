# metalsmith-metafiles [![Build Status](https://travis-ci.org/Ajedi32/metalsmith-metafiles.svg)](https://travis-ci.org/Ajedi32/metalsmith-metafiles)

A [Metalsmith][metalsmith] plugin to read file metadata from separate files (as
an alternative to frontmatter).

For example, when using this plugin you could add metadata to a file named
`index.html` by creating a file named `index.html.meta.json` and putting your
metadata in that file.

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

Currently, two named parsers are supported: `"JSON.parse"` (which is exactly
what it sounds like), and "`js-yaml`" (an npm package which parses YAML
formatted data files). To use the YAML metadata format, you must have `js-yaml`
installed.

By default, the `.json` files use the `"JSON.parse"` parser, and `.yaml` files
(if enabled with `{".yaml": true}`) use the `js-yaml` parser.

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
