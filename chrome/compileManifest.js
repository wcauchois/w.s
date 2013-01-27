var mustache = require('../node/node_modules/mu2'),
    fs = require('fs'),
    util = require('util');

var stream = mustache.compileAndRender('manifest.mustache', {
  dev_config: require('../config.dev.js'),
  prod_config: require('../config.prod.js')
});
var outStream = fs.createWriteStream('manifest.json');
util.pump(stream, outStream);
