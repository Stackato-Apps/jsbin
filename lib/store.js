function Store(options) {
  var Adapter = require('./db/' + options.adapter);
  this.adapter = new Adapter(options[options.adapter]);
}

// Methods that should be supported by adaptors.
var methods = [
  'connect',
  'disconnect',
  'setBin',
  'setBinUser',
  'setBinPanel',
  'getBin',
  'getLatestBin',
  'getLatestBinForUser',
  'getBinsByUser',
  'generateBinId',
  'getUser',
  'getUserByEmail',
  'setUser',
  'touchLogin',
  'touchOwnership',
  'updateUserEmail',
  'updateUserKey',
  'upgradeUserKey',
  'getUserByForgotToken',
  'setForgotToken',
  'expireForgotToken',
  'expireForgotTokenByUser',
  'reportBin'
];

// Proxy the methods through the store.
methods.forEach(function (method) {
  Store.prototype[method] = function () {
    this.adapter[method].apply(this.adapter, arguments);
  };
});

module.exports = function createStore(options) {
  if(process.env.STACKATO_SERVICES){
    var srv = JSON.parse(process.env.STACKATO_SERVICES);
    options.adapter = 'mysql';
    options.mysql = {
        host : srv.bindata.host,
        user : srv.bindata.user,
        password : srv.bindata.password,
        database : srv.bindata.name
    }
  }
  return new Store(options);
};

module.exports.Store = Store;
