const Joi = require('joi');

const otpSchema = Joi.object().keys({
  id: Joi.string().required(),
  otp: Joi.string().optional(),
});

module.exports = {
  otpSchema,
};