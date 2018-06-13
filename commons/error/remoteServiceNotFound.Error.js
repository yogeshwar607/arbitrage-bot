// multilevel Error handling

function RemoteServiceNotFound(message, obj) {
  this.name = 'RemoteServiceNotFound';
  this.message = message;
  if (obj) {
    this.responseObj = obj;
  }
}

RemoteServiceNotFound.prototype = new Error();

module.exports = RemoteServiceNotFound;