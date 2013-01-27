w.s uses JSON for configuration. `config.dev.json` specifies configuration options
for development. `config.prod.json` specifies configuration options for production.
`config.common.json` contains configuration options that will be merged into both
modes of configuration. When starting the node server, specify development mode or
production mode by setting the environment variable MODE to 'dev' or 'prod'. In
the chrome extension, go to options (a link is available at
[chrome://extensions](chrome://extensions)) and use the radio buttons to select
Dev or Prod.

Options
-------
* `DB`: The Mongo database to use.
* `MONGO_HOST`: The hostname for the MongoDB server.
* `MONGO_PORT`: The port for the MongoDB server.
* `AWS_BUCKET`: The Amazon S3 bucket to use for static resources.
* `HOST`: The hostname for the Node server itself.
* `PORT`: The port to run the Node server on.
* `VISIBLE_PORT`: The port the Node server is accessible at, if for example using Nginx.
* `SOCKET_IO_HOST`: The hostname that socket.io is running on.
* `SOCKET_IO_PORT`: The port to run socket.io on.
* `DEBUG`: Whether debug mode is on.
