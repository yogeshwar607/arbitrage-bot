// multilevel Error handling
function ApplicationError(message) {
  this.name = 'ApplicationError';
  this.message = message;
}

ApplicationError.prototype = new Error();

module.exports = ApplicationError;