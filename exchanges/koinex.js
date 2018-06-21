const rp = require('request-promise');
const cloudscraper = require('cloudscraper');

const options = {
    uri: 'https://koinex.in/api/ticker',
    method: 'GET',
    json: true
}

const ticker = () => {
      cloudscraper.get('https://koinex.in/api/dashboards/ticker', function (error, response, body) {
        if (error) {
          console.log('Error occurred');
        } else {
          console.log(JSON.parse(body)); //  always include it in try catch
        }
      });
    // { BTC: data.BTC, ETH: data.ETH, LTC: data.LTC, XRP: data.XRP }
  }
ticker()

// rp(options)
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     })