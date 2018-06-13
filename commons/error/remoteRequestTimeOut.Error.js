// multilevel Error handling

function RemoteRequestTimeOut(message) {
  this.name = 'RemoteRequestTimeOut';
  this.message = message;
}

RemoteRequestTimeOut.prototype = new Error();

module.exports = RemoteRequestTimeOut;