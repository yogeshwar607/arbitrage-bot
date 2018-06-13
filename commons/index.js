const ERROR = require('./error');
const DAO = require('./dao');
const UTILS = require('./utils');
const SCHEMA = require('./schema');
const DATABASE = require('./database');
const TABLES = require('./tables');

const obj = {
    ERROR,
    UTILS,
    DAO,
    SCHEMA,
    DATABASE,
    TABLES,
};
module.exports = obj;