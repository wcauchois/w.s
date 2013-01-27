var dev_config = {
  DB: 'w_s',
  MONGO_HOST: '127.0.0.1',
  MONGO_PORT: 27017,
  HOST: 'local.w.s',
  PORT: 8080,
  VISIBLE_PORT: 8080,
  SOCKET_IO_HOST: 'local.w.s',
  SOCKET_IO_PORT: 8079,
  DEBUG: true
};
if (typeof exports != undefined)
  module.exports = dev_config;

