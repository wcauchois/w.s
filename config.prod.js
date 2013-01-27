// REMEMBER to `make' after changing this file
// So it gets copied to chrome/ and node/
var config = {
  prod: {
    DB: 'w_s',
    MONGO_HOST: '127.0.0.1',
    MONGO_PORT: 27017,
    HOST: 'w.s',
    PORT: 8080,
    SOCKET_IO_HOST: 'w.s',
    SOCKET_IO_PORT: 8079,
    DEBUG: false
  }
};
if (typeof exports != undefined)
  exports = config.prod;

