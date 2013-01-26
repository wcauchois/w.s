var http = require('http'),
    mustache = require('mu2'),
    util = require('util'),
    mongo = require('mongodb');

if (process.env.MODE == undefined)
  process.env.MODE = 'dev';
var config = require('./config.' + process.env.MODE + '.js');

mustache.root = __dirname + '/templates';

function fail(response, debug) {
  response.writeHead(500, {'Content-Type': 'text/plain'});
  response.write('Internal server error');
  if (config.DEBUG)
    response.write('\n\n' + util.inspect(debug));
}

function index(client, request, response) {
  client.collection('posts', function(err, collection) {
    if (err != null)
      fail(response, err);
    else {
      collection.find().toArray(function(err, docs) {
        if (err != null)
          fail(response, err);
        else {
          var values = {posts: docs};
          var stream = mustache.compileAndRender('index.mustache', values);
          response.writeHead(200, {'Content-Type': 'text/html'});
          util.pump(stream, response);
        }
      });
    }
  });
}

function post(client, request, response) {
  client.collection('posts', function(err, collection) {
    if (err != null)
      fail(response, err);
    else {
      // something something something
    }
  });
}

var routes = [
  {pattern: /\/$/, method: 'GET', handler: index}
];

var db = new mongo.Db(config.DB,
  new mongo.Server(config.MONGO_HOST, config.MONGO_PORT, {}), {w: 1});
db.open(function(err, client) {
  if (err != null) {
    console.error(err);
    process.exit(1);
  } else {
    var server = http.createServer(function (request, response) {
      var handled = false;
      routes.forEach(function(entry) {
        if (request.url.match(entry.pattern) != null &&
            request.method == entry.method) {
          entry.handler(client, request, response);
          handled = true;
        }
      });
      if (!handled) {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('Not found\n');
      }
      if (config.DEBUG) mustache.clearCache();
    });

    server.listen(config.PORT);
    console.log('Server listening on port ' + config.PORT);
  }
});

