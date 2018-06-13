const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

function basicMiddlewares(app) {
  // throws 400 error to next, if JSON is not valid
  app.use(bodyParser.json({
    strict: true,
    limit:'50mb'
  }));

  // parses the url encoded strings
  app.use(bodyParser.urlencoded({
    extended: true,
    limit:'50mb'
  }));

  // logs incoming request in dev pattern
  // app.use(morgan('dev'));
  app.use(morgan('dev', { stream: logger.stream }));
  // CORS enabled
  app.use(cors());
}

module.exports = basicMiddlewares;