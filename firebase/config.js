require('../envVars');
const config = require('nconf');
const admin = require("firebase-admin");
const serviceAccount = require("./alarmapp.json");
const fireBaseUrl = config.fireBaseUrl;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: fireBaseUrl,
});
const db = admin.firestore();

module.exports = {
    db,};