// multilevel Error handling

function PageNotFound(message) {
  this.name = 'PageNotFound';
  this.message = message;
}

PageNotFound.prototype = new Error();

module.exports = PageNotFound;