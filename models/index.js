const mongoose = require('mongoose');

// Setting default SYSTEM PROMISE
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// loading all the models

const User = mongoose.model('user', require('./user.schema')(Schema));

// registring models
const model = {
    User,
};

module.exports = model;