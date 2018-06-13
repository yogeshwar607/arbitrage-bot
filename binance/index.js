const api = require('./lib/binance');

const binanceWS = new api.BinanceWS(true);

// binanceWS.onDepthUpdate('ETHUSDT', (data) => {
//     console.log(data);
// });

binanceWS.onTicker('ETHUSDT', (data) => {
    console.log(data);
});