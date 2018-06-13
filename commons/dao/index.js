const batchDAO = require('./batch.DAO');
const transactionDAO = require('./transaction.DAO');
const clientDAO = require('./client.DAO');
const userDAO = require('./user.DAO');
const beneficiaryDAO = require('./beneficiary.DAO');
const remitterDAO = require('./remitter.DAO');
const generalLedgerDAO = require('./generalLedger.DAO');
const accountDAO = require('./account.DAO');
const menuDAO = require('./menu.DAO');
const roleDAO = require('./role.DAO');
const debitCreditDAO = require('./debitCredit.DAO');


module.exports = {
  batchDAO,
  transactionDAO,
  clientDAO,
  userDAO,
  beneficiaryDAO,
  remitterDAO,
  generalLedgerDAO,
  accountDAO,
  menuDAO,
  roleDAO,
  debitCreditDAO,
};