// multilevel Error handling

function ValidationError(message) {
  this.name = 'ValidationError';
  this.message = message;
}

ValidationError.prototype = new Error();
module.exports = ValidationError;