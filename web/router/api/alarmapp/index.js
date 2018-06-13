
const createAlert = require('./create.handler.js');

const test = (req, res, next) =>{
    return res.json({
        success:true,
        msg:"server test successful"
    })
}

module.exports = (router) => {
    router.get('/test', test);
    router.post('/alerts/create',createAlert);
};