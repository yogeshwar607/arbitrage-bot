const mongoose = require('mongoose');
const database = require('./database');
const server = require('./server');

function init() {
  const options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  };

  if (server.isDevelopment) {
    mongoose.connect(database.connectionString, options);
  } else {
    // disabled in production since index creation can cause a significant performance impact
    mongoose.connect(database.connectionString,
      Object.assign({}, { config: { autoIndex: false } }, options));
  }

  logger.debug(`Connection url: ${database.connectionString}`);

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', () => {
    logger.info(`Mongoose default connection open to ${database.dbURI} / ${database.db}`);
  });

  // If the connection throws an error
  mongoose.connection.on('error', (err) => {
    logger.error(`Mongoose default connection error: ${err}`);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      logger.info('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });

  // LOADING MODELS
  rootRequire('models');
}


module.exports = { init };