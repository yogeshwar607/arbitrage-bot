const api = require('./lib/binance');

const binanceWS = new api.BinanceWS(true);

const {
    redisClient
} = require('../config');

binanceWS.onDepthUpdate('ETHUSDT', (data) => {
    console.log(data);
});

// binanceWS.onTicker('ETHUSDT', (data) => {
//     console.log(data);
// });

// redisClient.get('test', (err, obj) => {
//     if (err) {
//       console.error(`Redis Error while fetching data: ${err.message}`);
//     }
//     if (obj !== 'nil') {
//         console.log(obj);
//     }
//   });
