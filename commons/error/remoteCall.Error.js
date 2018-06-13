// multilevel Error handling
function RemoteCallError(message, obj) {
  this.name = 'RemoteCallError';
  this.message = message;
  if (obj) {
    this.responseObject = obj;
  }
}

RemoteCallError.prototype = new Error();

module.exports = RemoteCallError;