const ValidationError = require('./validation.Error');
const ApplicationError = require('./application.Error');
const AuthorizationError = require('./authorization.Error');
const PageNotFound = require('./pageNotFound.Error');
const RemoteCallError = require('./remoteCall.Error');
const RemoteRequestTimeOut = require('./remoteRequestTimeOut.Error');
const RemoteServiceNotFound = require('./remoteServiceNotFound.Error');

module.exports = {
  ValidationError,
  ApplicationError,
  AuthorizationError,
  PageNotFound,
  RemoteCallError,
  RemoteRequestTimeOut,
  RemoteServiceNotFound,
};