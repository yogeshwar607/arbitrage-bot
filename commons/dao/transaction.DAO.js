// const assert = require('assert');
const { ValidationError } = require('../error');

const MODEL = rootRequire('models').Transaction;
const DAO = require('./DAO'); // return constructor function.

const batchDAO = require('./batch.DAO')();

function TransactionDAO() {
  this.Model = MODEL;
  // this.clientId = clientId;
}

function* saveUnique(doc) {
  // find the payment is already present or not
  // if yes then update it with new records,
  // if not the create a new document.
  try {
    const document = new this.Model(doc);
    const obj = yield document.save();
    batchDAO.findByIdAndUpdate(doc.batch, { $inc: { 'counter.APPROVAL_PENDING': 1 } });
    return obj;
  } catch (e) {
    if (e.code === 11000) {
      const objError = new ValidationError(`Duplicate File name ${doc.file_name}`);
      objError.transaction_number = doc.transaction_number;
      objError.code = 11000;
      batchDAO.findByIdAndUpdate(doc.batch, { $inc: { 'counter.ERROR': 1 } });
      throw objError;
    } else {
      throw e;
    }
  }
}

// Prototypal Inheritance
TransactionDAO.prototype = new DAO();

TransactionDAO.prototype.saveUnique = saveUnique;

module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new TransactionDAO();
};