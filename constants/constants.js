const envConfig = require('nconf');

const NODE_ENV = envConfig.get("NODE_ENV") || 'development';

module.exports = {
  get PASSWORD_REGEX() {
    if (NODE_ENV === 'production') {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,32}$/;
    } else {
      return /[\s\S]*/;
    }
  },
 
};