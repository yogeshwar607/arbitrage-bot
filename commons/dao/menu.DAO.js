// const assert = require('assert');

const MODEL = rootRequire('models').Menu;
const DAO = require('./DAO'); // return constructor function.

function MenuDAO(clientId) {
  this.Model = MODEL;
  this.clientId = clientId;
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
MenuDAO.prototype = new DAO();
// MenuDAO.prototype.find = find;
// MenuDAO.prototype.save = save;

module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new MenuDAO();
};