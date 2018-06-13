// list of all the properties binded to Global Scope

global.rootRequire = function (name) {
  return require(__dirname + '/' + name);
};

global.logger = require('./config').logger;