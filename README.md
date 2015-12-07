# metalsmith-metafiles [![Build Status](https://travis-ci.org/Ajedi32/metalsmith-metafiles.svg)](https://travis-ci.org/Ajedi32/metalsmith-metafiles)

A [Metalsmith][metalsmith] plugin to read file metadata from separate files (as
an alternative to frontmatter).

For example, when using this plugin you could add metadata to a file named
`index.html` by creating a file named `index.html.metadata.json` and putting
your metadata in that file.

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

For example, setting this option to false would result in your `.metadata.json`
files being put in your destination directory when you build the site. (Unless
of course they're removed by some other plugin.)

### `postfix`

Type: `String`

Default: `.metadata`

The postfix added to filenames to indicate they are metadata files. This doesn't
include the file extension, only the extra text before the extension.

For example, setting this option to `.m` would allow you to use `*.m.json` files
to store file metadata instead of `*.metadata.json` files. Values without a `.`
in them are also allowed. For example, `meta` would result in `*meta.json` being
used to store metadata.

### `prefix`

Type: `String`

Default: `""`

The prefix added to filenames to indicate they are metadata files.

For example, setting this option to `"m-"`, in combination with the default
postfix value of `".metadata"`, would result in `m-*.metadata.json` files being
used to store metadata.

## License

MIT (See [LICENSE](./LICENSE) file)

[metalsmith]: https://github.com/segmentio/metalsmith
