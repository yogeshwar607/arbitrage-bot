const AppError = rootRequire('commons').ERROR;
const { jwtSecret } = rootRequire('config').server;
const { query:pgQuery } = rootRequire('db');

const config = rootRequire('config').server;
const jwt = require('jsonwebtoken');
const Boom = require('boom');

const request = require('superagent');
// const Schema = require('mongoose').Schema;

async function authorization(router) {
    router.use((req, res, next) => {
        // validate user and X-ACCESS-TOKEN
        const token = req.get('X-ACCESS-TOKEN');
        const agent = req.get('user-agent');
        const ip = req.get('ip');
        // const clientId = req.get('X-CLIENT-ID');
        if (!token) return next(new AppError.AuthorizationError('X-ACCESS-TOKEN header is required'));
        // if (!clientId) return next(new AppError.AuthorizationError('X-CLIENT-ID header is required'));
        jwt.verify(token, jwtSecret, async function(err, decoded) {
            if (err) {
                logger.error(`The error while decoding token ${err}`);
                return next(err);
            }
            let values = [decoded.sub.id];

            if (decoded.sub.loginType == "customer") {
        
                const {
                    rows: a
                } = await pgQuery('SELECT email FROM "Remittance".customer WHERE registration_id=$1', values);
        
                if (a.length === 0) {
                    return next(Boom.AuthorizationError('Authentication failed. User not found.'));
                } else {
                    request
                        .get('https://ipinfo.io/' + ip + '/json')
                        .end((err, res) => {
                            console.log("");
                            // await paramQuery('INSERT INTO "Remittance".customer_geo_detail(' +
                            //     'email, activity_type, ip_address, country, city, browser, ' +
                            //     ' device, created_on)' +
                            //     ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)', values);
                            return next();
                        });

                }

            } else if (decoded.sub.loginType == "admin") {

                const {
                    rows: a
                } = await pgQuery('SELECT email FROM "Remittance".admin_user WHERE id=$1', values);
        
                if (a.length === 0) {
                    return next(Boom.AuthorizationError('Authentication failed. User Admin not found.'));
                } else {
                    return next();
                }
            }
        });
    });
}

module.exports = authorization;