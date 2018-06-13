const Boom = require('boom');
const config = require('nconf');

const postgreSQLErrorMapper = {
  22023: 400,
  P0002: 500,
};

module.exports = function (app) {
  // Error: 404
  app.use((req, res, next) => {
    next(Boom.notFound('Invalid endpoint'));
  });

  app.use((err, req, res, next) => {
    // Convert if error does not belong to Boom object
    // Also map postgreSQL error
    const _err = err.isBoom ? err : Boom.boomify(err, { statusCode: err.code ? postgreSQLErrorMapper[err.code] : 500 });
    /** Boom error */
    const payload = {
      error: _err.output.payload.error,
      message: _err.message,
      statusCode: _err.output.payload.statusCode,
    };
    if (config.get('NODE_ENV') === 'development') logger.error(`Stack: ${_err.stack}`);
    logger.error(`Name: ${payload.error} | message: ${payload.message} | status: ${payload.statusCode}`);
    res.status(payload.statusCode).json({
      success: false,
      data: payload,
    });
    next();
  });
};