const basic = require('./basic.middleware');
const handleError = require('./handleError.middleware');
const authorization = require('./authorization.middleware');
const requestLogger = require('./requestLogger.middleware');
const multer = require('./multer.middleware');

module.exports = {
  basic,
  handleError,
  authorization,
  requestLogger,
  multer,
};