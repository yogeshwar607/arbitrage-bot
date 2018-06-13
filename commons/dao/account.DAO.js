// const assert = require('assert');

const MODEL = rootRequire('models').Account;
const DAO = require('./DAO'); // return constructor function.

function AccountDAO() {
  this.Model = MODEL;
  // this.clientId = clientId;
}


// Prototypal Inheritance
AccountDAO.prototype = new DAO();

module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new AccountDAO();
};