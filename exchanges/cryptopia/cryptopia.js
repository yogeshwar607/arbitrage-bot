const rp = require('request-promise');

const options = {
    uri: 'https://www.cryptopia.co.nz/api/GetMarkets/USDT',
    method: 'GET',
    json: true
}

const ticker = () => {
    rp(options)
        .then((result) => {
            console.log(result)
        })
        .catch((err) => {
            console.log(err)
        })
}

setInterval(ticker, 150);

// { TradePairId: 5207,
//     Label: 'ETH/USDT',
//     AskPrice: 534.99999992,
//     BidPrice: 524.2,
//     Low: 527.03861594,
//     High: 544.18414329,
//     Volume: 44.91807275,
//     LastPrice: 529.04597999,
//     BuyVolume: 231698830.43035448,
//     SellVolume: 170.15558111,
//     Change: -2.03,
//     Open: 539.99999999,
//     Close: 529.04597999,
//     BaseVolume: 24030.63089522,
//     BuyBaseVolume: 26491.4968464,
//     SellBaseVolume: 71560821.57437904 },


/**
 * const intervalObj = setInterval(() => {
  console.log('interviewing the interval');
}, 500);

clearTimeout(timeoutObj);
clearImmediate(immediateObj);
clearInterval(intervalObj);
 * /