// const assert = require('assert');

const MODEL = rootRequire('models').GeneralLedger;
const { toObjectId } = require('../utils');
const DAO = require('./DAO');

function GeneralLedgerDAO() {
  this.Model = MODEL;
  // this.clientId = clientId;
}

/**
 * Fetches the wallet balance of all the accounts or specific account in general ledger
 * @param  {object} context
 * @param  {array} accountIds
 */
function getAccountBalance(context, accountIds) {
  const _accountIds = accountIds || [];
  const matchQuery = {};
  matchQuery.client = { $in: toObjectId(context.clientAccessIds) };
  if (_accountIds && _accountIds.length > 0) {
    matchQuery.account = { $in: toObjectId(_accountIds) };
  }
  return this.Model.aggregate([
    { $match: matchQuery },
    { $sort: { created_at: 1 } },
    {
      $group: {
        _id: '$account',
        balance: { $last: '$running_balance' },
      },
    },
  ]).then((accounts) => {
    return accounts.reduce((obj, val) => {
      obj[val._id] = val.balance;
      return obj;
    }, {});
  });
}
// Prototypal Inheritance
GeneralLedgerDAO.prototype = new DAO();
GeneralLedgerDAO.prototype.getAccountBalance = getAccountBalance;

module.exports = function () {
  // assert.ok(clientId, 'clientId is empty');
  return new GeneralLedgerDAO();
};