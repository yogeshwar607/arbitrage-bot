// multilevel Error handling

function AuthorizationError(message) {
  this.name = 'AuthorizationError';
  this.message = message;
}

AuthorizationError.prototype = new Error();

module.exports = AuthorizationError;