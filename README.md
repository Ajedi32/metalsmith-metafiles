# metalsmith-metafiles [![Build Status](https://travis-ci.org/Ajedi32/metalsmith-metafiles.svg)](https://travis-ci.org/Ajedi32/metalsmith-metafiles)

A Metalsmith plugin to read file metadata from separate files (as an alternative
to frontmatter).

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
  "plugins": {
    "metalsmith-metafiles": true,
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
  .use(metafiles())
  .use(/* Other plugins... */)
  .build(function(err) {
    if (err) throw err;
  });
```

## License

MIT (See [LICENSE](./LICENSE) file)
