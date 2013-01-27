var http = require('http'),
    mustache = require('mu2'),
    util = require('util'),
    mongo = require('mongodb'),
    querystring = require('querystring'),
    events = require('events'),
    fs = require('fs'),
    url = require('url');

if (process.env.MODE == undefined)
  process.env.MODE = 'dev';
var config = require('./config.' + process.env.MODE + '.js');

mustache.root = __dirname + '/templates';

function fail(response, err) {
  response.writeHead(500, {'Content-Type': 'text/plain'});
  response.write('Internal server error');
  console.error(err);
  if (config.DEBUG)
    response.write('\n\n' + err);
}

function index(client, emitter, request, response) {
  client.collection('posts', function(err, collection) {
    if (err)
      fail(response, err);
    else {
      collection.find().sort({timestamp: -1}).limit(20).toArray(function(err, docs) {
        if (err)
          fail(response, err);
        else {
          fs.readFile('./templates/post.mustache', function(err, postTemplate) {
            if (err)
              fail(response, err);
            else {
              var values = {
                posts: docs,
                config: config,
                postTemplate: postTemplate
              };
              var stream = mustache.compileAndRender('index.mustache', values);
              response.writeHead(200, {'Content-Type': 'text/html'});
              util.pump(stream, response);
            }
          });
        }
      });
    }
  });
}

function validatePost(doc) {
  return doc.body != undefined &&
    doc.body.length > 0 &&
    doc.author != undefined &&
    doc.url != undefined &&
    doc.url.length > 0
}

function post(client, emitter, request, response) {
  var rawData = '';
  request.on('data', function(chunk) {
    rawData += chunk;
  });
  request.on('end', function() {
    console.log(rawData);
    var data = querystring.parse(rawData);
    client.collection('posts', function(err, collection) {
      if (err)
        fail(response, err);
      else {
        var doc = {
          body: data.body,
          author: data.author, // TODO: if author is null, set to Anonymous
          url: data.url,
          timestamp: Math.round(new Date().getTime() / 1000)
        }
        if (!validatePost(doc)) {
          response.writeHead(400, {'Content-Type': 'text/plain'});
          response.end('Bad request');
        } else {
          collection.insert(doc, function(err, docs) {
            if (err)
              fail(response, err);
            else {
              emitter.emit('newPost', docs[0]);
              response.writeHead(302, {'Location': '/'});
              response.end(JSON.stringify(docs[0]));
            }
          });
        }
      }
    });
  });
}

function posts(client, emitter, request, response) {
  client.collection('posts', function(err, collection) {
    if (err)
      fail(response, err);
    else {
      var data = querystring.parse(url.parse(request.url).search.substring(1));
      var where = data['for'] == undefined ? {} : {url: data['for']};
      var query = collection.find(where).sort({timestamp: -1});
      var limit = parseInt(data.limit);
      query = query.limit(limit == NaN ? 20 : limit);
      query.toArray(function(err, docs) {
        if (err)
          fail(response, err);
        else {
          response.writeHead(200, {'Content-Type': 'application/json'});
          response.end(JSON.stringify(docs));
        }
      });
    }
  });
}

var routes = [
  {pattern: /\/$/, method: 'GET', handler: index},
  {pattern: /\/post$/, method: 'POST', handler: post},
  {pattern: /\/posts$/, method: 'GET', handler: posts}
];

var db = new mongo.Db(config.DB,
  new mongo.Server(config.MONGO_HOST, config.MONGO_PORT, {}), {w: 1});
db.open(function(err, client) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    var emitter = new events.EventEmitter();
    var server = http.createServer(function (request, response) {
      var handled = false;
      routes.forEach(function(entry) {
        var pathname = url.parse(request.url).pathname;
        if (pathname.match(entry.pattern) != null &&
            request.method == entry.method) {
          entry.handler(client, emitter, request, response);
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

    var io = require('socket.io').listen(config.SOCKET_IO_PORT);
    io.sockets.on('connection', function(socket) {
      var newPostListener = function(post) {
        socket.emit('newPost', {post: post});
      };
      emitter.on('newPost', newPostListener);
      socket.on('disconnect', function() {
        emitter.removeListener('newPost', newPostListener);
      });
    });
    console.log('HTTP server listening on port ' + config.PORT);
  }
});

