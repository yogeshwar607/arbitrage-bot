const joi = require('joi');
const nconf = require('nconf');

const envVarsSchema = joi.object({
        NODE_ENV: joi.string()
            .allow(['development', 'production', 'test', 'provision','staging'])
            .required(),
        PORT: joi.number()
            .required(),
    }).unknown()
    .required();

const { error, value: envVars } = joi.validate(nconf.get(), envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    isTest: envVars.NODE_ENV === 'test',
    isDevelopment: envVars.NODE_ENV === 'development',
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
    fxappid: envVars.FxRate_AppID,
};

module.exports = config;