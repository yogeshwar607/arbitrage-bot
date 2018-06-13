// const assert = require('assert');

const MODEL = rootRequire('models').Client;
const DAO = require('./DAO'); // return constructor function.

function ClientDAO() {
  this.Model = MODEL;
  // this.clientId = clientId;
}

// function findOne(query, projection = null) {
//   query.client_name = this.clientId;
//   return this.Model.findOne(query, projection).exec();
// }

// function find(query, projection = null) {
//   // query.client = this.clientId;
//   return this.Model.find(query, projection).exec();
// }

// Prototypal Inheritance
ClientDAO.prototype = new DAO();

// ClientDAO.prototype.findOne = findOne;
// ClientDAO.prototype.find = find;

module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new ClientDAO();
};