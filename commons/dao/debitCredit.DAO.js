// const assert = require('assert');

const MODEL = rootRequire('models').DebitCredit;
const DAO = require('./DAO'); // return constructor function.

function DebitCreditDAO() {
  this.Model = MODEL;
  // this.clientId = clientId;
}
// Prototypal Inheritance
DebitCreditDAO.prototype = new DAO();

module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new DebitCreditDAO();
};