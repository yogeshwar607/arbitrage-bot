// const assert = require('assert');
const { ValidationError } = require('../error');

const MODEL = rootRequire('models').Beneficiary;
const DAO = require('./DAO'); // return constructor function.

function BeneficiaryDAO() {
  this.Model = MODEL;
  // this.clientId = clientId;
}


function* findAndCreate(query, doc) {
  // find the payment is already present or not
  // if yes then update it with new records,
  // if not the create a new document.
  try {
    query.client = this.clientId;
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
      const objError = new ValidationError(`Beneficiary name ${doc.beneficiary_name} already exist.`);
      objError.transaction_number = doc.transaction_number;
      objError.code = 11000;
      throw objError;
    } else {
      throw e;
    }
  }
}

// Prototypal Inheritance
BeneficiaryDAO.prototype = new DAO();

BeneficiaryDAO.prototype.saveUnique = saveUnique;
BeneficiaryDAO.prototype.findAndCreate = findAndCreate;


module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new BeneficiaryDAO();
};