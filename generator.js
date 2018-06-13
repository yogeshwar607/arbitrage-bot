const crypto = require('crypto-js');
const Base64 = require('crypto-js/enc-base64');

function createHash(value){
    return Base64.stringify(crypto.HmacSHA1(value,''));
}

const pass = createHash(process.argv[2]);
console.log(pass);