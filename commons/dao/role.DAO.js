// const assert = require('assert');

const MODEL = rootRequire('models').Role;
const DAO = require('./DAO'); // return constructor function.

function RoleDAO() {
  this.Model = MODEL;
  // this.clientId = clientId;
}

// function find(query, projection = null) {
//   // query.client = this.clientId;
//   return this.Model.find(query, projection).exec();
// }

// function save(doc) {
//   // doc.client = this.clientId;
//   const document = new this.Model(doc);
//   return document.save();
// }

// Prototypal Inheritance
RoleDAO.prototype = new DAO();
// RoleDAO.prototype.find = find;
// RoleDAO.prototype.save = save;

module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new RoleDAO();
};