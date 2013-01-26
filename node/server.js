var http = require('http'),
    mustache = require('mu2'),
    util = require('util'),
    mongo = require('mongodb');

var PORT = 8080;
var DB = 'w_s';
var MONGO_HOST = '127.0.0.1';
var MONGO_PORT = 27017;
var DEBUG = true;

mustache.root = __dirname + '/templates';

function fail(response, debug) {
  response.writeHead(500, {'Content-Type': 'text/plain'});
  response.write('Internal server error\n\n');
  response.write(util.inspect(debug));
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

var routes = [
  {pattern: /\/$/, method: 'GET', handler: index}
];

var db = new mongo.Db(DB, new mongo.Server(MONGO_HOST, MONGO_PORT, {}), {w: 1});
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
      if (DEBUG) mustache.clearCache();
    });

    server.listen(PORT);
    console.log('Server listening on port ' + PORT);
  }
});

