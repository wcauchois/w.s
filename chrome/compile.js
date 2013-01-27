var mustache = require('../node/node_modules/mu2'),
    fs = require('fs'),
    util = require('util');

function compileManifest() {
  var stream = mustache.compileAndRender('manifest.mustache', {
    dev_config: require('../config.dev.js'),
    prod_config: require('../config.prod.js')
  });
  var outStream = fs.createWriteStream('manifest.json');
  util.pump(stream, outStream);
}

function compilePopupHtml() {
  fs.readFile('post.mustache', function(err, postTemplate) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var stream = mustache.compileAndRender('popup.mustache', {
      postTemplate: postTemplate
    });
    var outStream = fs.createWriteStream('popup.html');
    util.pump(stream, outStream);
  });
}

compileManifest();
compilePopupHtml();
