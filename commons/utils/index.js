const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios');
const papa = require('papaparse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('nconf');
// const geoip = require('geoip-lite');
const useragent = require('useragent');
const crypto = require('crypto');
const speakeasy = require('speakeasy');

useragent(true);

function isSpecialChar(str, withAmpersand = true) {
  const re = withAmpersand ? /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\':<>\?]/g : /[~`!#$%\^*+=\-\[\]\\';,/{}|\\':<>\?]/g
  const _isSpecialChar = re.test(str);
  return _isSpecialChar;
}

function isNumeric(num) {
  return !isNaN(num);
}

function isValidEmailAddress(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function getFirstAndLastNames(fullName) {
  return {
    firstName: fullName.split(' ').slice(0, -1).join(' '),
    lastName: fullName.split(' ').slice(-1).join(' '),
  };
}

function toObjectId(arg) {
  if (arg.constructor === Array) {
    return arg.map((val) => {
      return new mongoose.Types.ObjectId(val);
    });
  }
  return new mongoose.Types.ObjectId(arg);
}

function getSortColumnName(columns, order) {
  return columns[order[0]['column']]['name'];
}

function getSortColumnOrder(order) {
  return order[0]['dir'] === 'asc' ? 1 : -1;
}

// fetch data from query string and populate it to pagination filter
function getPaginationFilter(query) {
  const skip = parseInt(query.start, 10) || 0;
  const limit = parseInt(query.length, 10) || 10;
  const draw = parseInt(query.draw, 10);
  const search = query.search;
  const columns = query.columns;
  const order = query.order;
  const dbColumnName = getSortColumnName(columns, order);
  const sortOrder = getSortColumnOrder(order);
  const sort = {};
  sort[dbColumnName] = sortOrder;
  return {
    skip,
    limit,
    sort,
    draw,
    search
  };
}

function getErrorMessages(error) {
  if (error.details && error.details.length > 0) {
    return error.details.reduce((p, v) => {
      return `${p} ${v.message} </br>`;
    }, '');
  }
  return error.message;
}

/* ========================== Basic Utilities ============================ */

function randomNumber(digits) {
  const _digits = digits || 5;
  const multiplier = Math.pow(10, (_digits - 1)); // eslint-disable-line
  return Math.floor(multiplier + (Math.random() * (9 * multiplier)));
}

function isNumeric(num) {
  return !isNaN(num);
}

function toFixedDecimal(num, scale) {
  const _scale = scale || 2;
  return parseFloat(parseFloat(num).toFixed(_scale));
}

function removeSpaceFromString(text) {
  return text.replace(/ /g, '');
}

/**
 * Convert string to title string
 * @param {*} str
 */
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function trimObject(obj) {
  let value;
  Object.keys(obj).forEach((key) => {
    value = obj[key];
    if (value && typeof value === 'string') {
      obj[key] = value.trim();
    } else if (value && value.constructor === Object && typeof value === 'object') {
      obj[key] = trimObject(value);
    }
  });
  return obj;
}

function getErrorMessages(error) {
  if (error.details && error.details.length > 0) {
    return error.details.reduce((acc, v) => {
      acc.push(v.message);
      return acc;
    }, []).join('\n');
  }
  return error.message;
}

function getFullAddress({
  subAddr1,
  subAddr2,
  subAddr3
}) {
  const address = [];
  if (subAddr1) address.push(subAddr1);
  if (subAddr2) address.push(subAddr2);
  if (subAddr3) address.push(subAddr3);
  return address.join(' ');
}

function getAddressFromObj(obj) {
  const addressArray = Object.keys(obj).reduce((acc, key) => {
    if (obj[key]) {
      acc.push(obj[key]);
    }
    return acc;
  }, []);
  return addressArray.join(', ');
}

/**
 * Get Client IP Address from request details
 * @param {*} req
 */
function getClientIpAddress(req) {
  let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (clientIp.indexOf(':') !== -1) {
    // check for non x-forwarded-for headers request
    clientIp = clientIp.split(':').pop();
    // check for localhost
    if (clientIp === '1') {
      clientIp = '127.0.0.1';
    }
  }
  return clientIp;
}

/**
 * GET IP Informations
 * @param {*} req
 */

function getGEOIP(req) {
  const ip = req.clientIP;
  const geo = ip && ip !== '127.0.0.1' ? geoip.lookup(ip) : ip;
  return geo || ip;
}

function getUserAgent(userAgent) {
  return useragent.lookup(userAgent) || userAgent;
}

function sanitizeObj(obj) {
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (typeof val !== 'boolean') {
      /** val === '' added if blank update needs to be done */
      if (val || val === '' || val === 0) {
        obj[key] = val;
      } else {
        delete obj[key];
      }
    }
  });
  return obj;
}

function getHashedPassword(password) {
  return new Promise((resolve, reject) => {
    // generate a salt
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);
      // hash the password using our new salt
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        // override the cleartext password with the hashed one
        return resolve(hash);
      });
    });
  });
}

function comparePassword(candidatePassword, savedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, savedPassword, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
}

function generateRefreshToken(user) {
  const payloads = {
    sub: user.user_id,
    emailId: user.email,
    remitterId: user.remitter_id,
  };
  const refreshToken = jwt.sign(payloads, config.get('JWT_REFRESH_SECRET'), {
    expiresIn: parseInt(config.get('JWT_REFRESH_TOKEN_TIME'), 10)
  });
  return refreshToken;
}

function generateToken(user) {
  const payloads = {
    sub: user.user_id,
    emailId: user.email,
    /** If user exists then take remitter from session otherwise fetch from newly created remitter object */
    remitterId: user.remitter_id,
  };
  const token = jwt.sign(payloads, config.get('JWT_SECRET'), {
    expiresIn: parseInt(config.get('JWT_TOKEN_TIME'), 10)
  });
  return token;
}

function getFullName({
  firstName,
  middleName,
  lastName
}) {
  const fullName = [];
  if (firstName) {
    fullName.push(firstName);
  }
  if (middleName) {
    fullName.push(middleName);
  }
  if (lastName) {
    fullName.push(lastName);
  }
  return fullName.length > 0 ? fullName.join(' ') : '';
}

function getNameObj(inputName) {
  const names = inputName.split(' '); // split by spaces
  const firstName = names[0]; // first name
  const lastName = names[names.length - 1]; // last name
  const middleNameArray = names.reduce((acc, e, index, arr) => {
    if (index !== 0 && index !== arr.length - 1) {
      acc.push(e);
    }
    return acc;
  }, []);
  const middleName = middleNameArray.join(' ');
  return {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
  };
}

function getFormattedResponse(response, mapping) {
  const formattedResponse = Object.keys(mapping).reduce((obj, value) => {
    obj[value] = {};
    mapping[value].forEach(element => {
      if (response[element]) obj[value][element] = response[element];
    });
    return obj;
  }, {});
  return formattedResponse;
}


function generateSHA256Hash(value) {
  return crypto.createHash('sha256')
    .update(value)
    .digest('hex')
    .toUpperCase();
}




function getDeviceType(req, userAgent) {
  let deviceType;
  switch (req.device.toUpperCase()) {
    case 'DESKTOP':
      deviceType = 'WEB';
      break;
    case 'PHONE':
    case 'TABLET':
      if (userAgent && userAgent.family && (userAgent.family.toLowerCase() === 'mobileappb2c' || userAgent.family.toLowerCase() === 'okhttp')) {
        deviceType = 'MOBILE';
      } else {
        deviceType = 'MOBILE_WEB';
      }
      break;
    default:
      deviceType = 'WEB';
  }
  return deviceType;
}

/* =========================== Date Utilities ============================ */

// extracts date from datetime object
function toDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Convert String to Date
function parseDate(str, opts = {}) {
  const _format = opts.format || 'DD/MM/YYYY';
  const _setTime = opts.setTime || false;
  const momentDate = moment(str, _format);
  if (_setTime) {
    momentDate.set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999
    });
  }
  return momentDate.isValid() ? momentDate.toDate() : null;
}

// Convert Date to String
function formatDate(date, format) {
  const _format = format || 'DD/MM/YYYY';
  return moment(date).format(_format);
}

// Subtracts one month from Today's Date
function defaultStartDate() {
  return parseDate(formatDate(moment().subtract(1, 'month')));
}

// Today's Date
function defaultEndDate(opts = {}) {
  return parseDate(formatDate(moment()), {
    setTime: opts.setTime || false
  });
}

// First Date of current month
function startOfMonth() {
  return moment().startOf('month').toDate();
}

// Last Date of current month
function endOfMonth() {
  return moment().endOf('month').toDate();
}

// Get start of the day
function startOfDay(date) {
  if (date) {
    return moment(date).startOf('day');
  }
  return moment().startOf('day');
}

// Add Days to a date
function addDays(date, days) {
  return moment(date).add(days, 'days').toDate();
}

function postgresDateString(dateString, inputFormat) {
  if (dateString) {
    const _inputFormat = inputFormat || 'DD/MM/YYYY';
    return moment(dateString, _inputFormat).format('YYYY-MM-DD HH:mm:ss.SSSS');
  }
  return null;
}


/* ============================ CSV To JSON ============================ */

function downloadCSV(url) {
  return axios.get(url)
    .then((res) => {
      return res.data;
    });
}

function csvToJSON(csv) {
  return new Promise((resolve, reject) => {
    papa.parse(csv, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      error: function (err) {
        // executed if an error occurs while loading the file,
        // or if before callback aborted for some reason
        reject(err);
      },
      complete: function (results) {
        // console.log("Done Parsing")
        resolve(results.data);
      },
    });
  });
}





/** utility functions for sql  **/

function getCommaSeparatedColumns(obj) {
  return Object.keys(obj).join(',');
}

function getObjectValues(obj) {
  return Object.keys(obj).map((key) => obj[key]);
}

function getCommaSeparatedParamSubtitute(obj, counter) {
  let _counter = counter || 1;
  const params = [];
  Object.keys(obj).forEach(() => {
    params.push(`$${_counter}`);
    _counter += 1;
  }, this);
  return params.join(',');
}

function getUpdateSetClause(obj, counter) {
  let _counter = counter || 1;
  const result = Object.keys(obj).map((key) => {
    let pair = null;
    // JSON update handling added
    if (obj[key] && typeof obj[key] === 'object' && obj[key].constructor !== Date) {
      pair = `${key}=coalesce(${key},'{}') || $${_counter}`;
    } else {
      pair = `${key}=$${_counter}`;
    }
    _counter += 1;
    return pair;
  });
  return result.join(',');
}

/* token related functions */

function generateToken({
  secret
}) {
  // Generate a time-based token based on the base-32 key.
  // HOTP (counter-based tokens) can also be used if `totp` is replaced by
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });
}

function verifyToken({
  token,
  secret
}) {
  // Verify a given token is within 3 time-steps (+/- 4 minutes) from the server // time-step.
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 12,
    step: 30
  });
}

function generateSecret({
  length
}) {
  return speakeasy.generateSecret({
    length: length
  });
}

module.exports = {
  isSpecialChar,
  isNumeric,
  isValidEmailAddress,
  getFirstAndLastNames,
  getPaginationFilter,
  toObjectId,
  trimObject,
  getErrorMessages,
  getCommaSeparatedColumns,
  getObjectValues,
  getCommaSeparatedParamSubtitute,
  getUpdateSetClause,
  isNumeric,
  randomNumber,
  parseDate,
  formatDate,
  startOfMonth,
  endOfMonth,
  defaultStartDate,
  defaultEndDate,
  toDate,
  postgresDateString,
  downloadCSV,
  csvToJSON,
  addDays,
  trimObject,
  startOfDay,
  toTitleCase,
  getClientIpAddress,
  getGEOIP,
  getUserAgent,
  getErrorMessages,
  getFullAddress,
  toFixedDecimal,
  sanitizeObj,
  getHashedPassword,
  comparePassword,
  generateRefreshToken,
  generateToken,
  getFullName,
  getFormattedResponse,
  getNameObj,
  generateSHA256Hash,
  getAddressFromObj,
  getDeviceType,
  removeSpaceFromString,
  generateToken,
  verifyToken,
  generateSecret
};