/**
 * Setting basic configurations for Express and only expose app (express) object
 * for further processing.
 */
const app = require('express')();

module.exports = () => {
  // disabled for security reasons
  app.disable('x-powered-by');

  return app;
};