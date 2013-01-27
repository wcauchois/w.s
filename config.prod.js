// Remember to run `fab config' after modifying this file
var prod_config = {
  DB: 'w_s',
  MONGO_HOST: '127.0.0.1',
  MONGO_PORT: 27017,
  HOST: 'w.s',
  PORT: 8080,
  SOCKET_IO_HOST: 'w.s',
  SOCKET_IO_PORT: 8079,
  DEBUG: false
};
if (typeof exports != undefined)
  exports = prod_config;

