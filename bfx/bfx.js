'use strict'
// set environment variables first
require('../envVars');
const config = require('nconf');

const BFX = require('bitfinex-api-node')

const SocksProxyAgent = require('socks-proxy-agent')

const { API_KEY, API_SECRET, REST_URL, WS_URL, SOCKS_PROXY_URL } = config.get("BFX")
const agent = SOCKS_PROXY_URL ? new SocksProxyAgent(SOCKS_PROXY_URL) : null

const bfx = new BFX({
  apiKey: API_KEY,
  apiSecret: API_SECRET,

  ws: {
    url: WS_URL,
    agent
  },

  rest: {
    url: REST_URL,
    agent
  }
})

module.exports = bfx
