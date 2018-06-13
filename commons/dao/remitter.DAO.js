// const assert = require('assert');

const MODEL = rootRequire('models').Remitter;
const DAO = require('./DAO'); // return constructor function.

function RemitterDAO() {
  this.Model = MODEL;
  // this.clientId = clientId;
}


function* findAndCreate(query, doc) {
  // find the payment is already present or not
  // if yes then update it with new records,
  // if not the create a new document.
  try {
    // query.client = this.clientId;
    let data = yield this.Model.findOne(query).exec();

    if (!data) {
      const document = new this.Model(doc);
      data = yield document.save();
    }
    return data;
  } catch (e) {
    throw e;
  }
}

// Prototypal Inheritance
RemitterDAO.prototype = new DAO();

RemitterDAO.prototype.findAndCreate = findAndCreate;

module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new RemitterDAO();
};