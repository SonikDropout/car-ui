// through2 is a thin wrapper around node transform streams
const through = require('through2');
const PluginError = require('plugin-error');
const { compile } = require('svelte/compiler');
const vinylSourcemapsApply = require('vinyl-sourcemaps-apply');

// Consts
const PLUGIN_NAME = 'gulp-svelte';

// Plugin level function(dealing with files)
function gulpSvelte(options) {
  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    let result;

    try {
      result = compile(file.contents.toString(), {
        filename: file.path,
        ...options,
      });
    } catch (err) {
      if (file.path) {
        err.fileName = file.path;
      }

      cb(new PluginError(PLUGIN_NAME, err));
      return;
    }

    if (typeof result.css.code === 'string') {
      const cssFile = file.clone();
      if (file.path) cssFile.extname = '.css';
      cssFile.contents = Buffer.from(result.css.code);
      this.push(cssFile);
    }

    if (file.path) {
      file.extname = '.js';
      result.js.map.file = file.path
    }

    file.contents = Buffer.from(result.js.code);
    vinylSourcemapsApply(file.contents, result.js.map);    

    cb(null, file);
  });
}

// Exporting the plugin main function
module.exports = gulpSvelte;
