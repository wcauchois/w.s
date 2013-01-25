var http = require('http');
var mu = require('mu2');
var util = require('util');

var PORT = 8080;

mu.root = __dirname + '/templates';

function index(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  var values = {
    posts: [
      {
        body: 'Hello, world!',
        author: 'firefax',
        url: 'http://google.com',
        timestamp: 1359081154
      },
      {
        body: 'Goodbye, world!',
        author: 'firefax',
        url: 'http://images.google.com',
        timestamp: 1359081000
      }
    ]
  };
  var stream = mu.compileAndRender('index.mustache', values);
  util.pump(stream, response);
}

var routes = [
  {pattern: /\/$/, method: 'GET', handler: index}
];

var server = http.createServer(function (request, response) {
  var handled = false;
  routes.forEach(function(entry) {
    if (request.url.match(entry.pattern) != null &&
        request.method == entry.method) {
      entry.handler(request, response);
      handled = true;
    }
  });
  if (!handled) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('Not found\n');
  }
});

server.listen(PORT);

console.log('Server running on port ' + PORT);
