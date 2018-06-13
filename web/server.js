// Starting an API Server to expose functinalities
const { express, server } = rootRequire('config');

const app = express();

// mounting middlewares
const { basic, handleError } = require('./middleware');

basic(app);

// mounting routes
require('./router')(app);

handleError(app);

app.listen(server.port, (err) => {
  if (err) {
    logger.error(`Error while starting server at port ${server.port} | Error: ${err.message}`);
  }
  logger.info(`Express Server Up and Running @PORT: ${server.port} | at localhost`);
});

module.exports = app;