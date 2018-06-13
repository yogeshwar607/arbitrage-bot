const Joi = require('joi');
const {
  PASSWORD_REGEX
} = rootRequire('constants');

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().regex(PASSWORD_REGEX),
});

const createCustomerSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  mobile_number:  Joi.string().required(),
  first_name:  Joi.string().required(),
  last_name:  Joi.string().required(),
  company_name:  Joi.string().required(),
  country:  Joi.string().required(),
  cust_id: Joi.string().required(),
});

module.exports = {
  loginSchema,
  createCustomerSchema,
};
