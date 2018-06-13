// const assert = require('assert');

const MODEL = rootRequire('models').Batch;
const DAO = require('./DAO'); // return constructor function.

const { ValidationError } = require('../error');

function BatchDAO() {
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
    return obj;
  } catch (e) {
    if (e.code === 11000) {
      const objError = new ValidationError(`Duplicate batch_ID ${doc.batch_id}`);
      objError.file_name = doc.file_name;
      objError.code = 11000;
      throw objError;
    } else {
      throw e;
    }
  }
}

// function* saveUniqueBatch({ query, doc }) {
//   // find the payment is already present or not
//   // if yes then update it with new records,
//   // if not the create a new document.
//   try {
//     query.client = this.clientId;
//     const data = yield this.Model.findOne(query).exec();

//     if (data) {
//       // duplicate file name
//       throw new ValidationError(`Duplicate File name ${doc.file_name}`);
//     }
//     // else part
//     const document = new this.Model(doc);
//     return document.save();
//   } catch (e) {
//     throw e;
//   }
// }

// Prototypal Inheritance
BatchDAO.prototype = new DAO();

BatchDAO.prototype.saveUnique = saveUnique;

module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new BatchDAO();
};