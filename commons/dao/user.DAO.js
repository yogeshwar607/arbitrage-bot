// const assert = require('assert');

const MODEL = rootRequire('models').User;
const DAO = require('./DAO'); // return constructor function.

function UserDAO() {
  this.Model = MODEL;
  // this.clientId = clientId;
}

function getUserPrivileges(query) {
  return this.Model.findOne(query)
    .populate({ path: 'roles client client_access', populate: { path: 'menus' } })
    .exec();
}

// Prototypal Inheritance
UserDAO.prototype = new DAO();

UserDAO.prototype.getUserPrivileges = getUserPrivileges;
module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new UserDAO();
};