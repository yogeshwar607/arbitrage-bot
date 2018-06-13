const winston = require('winston');
const envConfig = require('nconf');

winston.emitErrs = true;

const logger = new winston.Logger({

  transports: [
    new winston.transports.Console({
      level: envConfig.get("LOGGER_LEVEL") || 'info',
      handleExceptions: false,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;

module.exports.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};