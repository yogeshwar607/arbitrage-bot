function config() {
    return {
      dbURI: 'redis-17441.c15.us-east-1-4.ec2.cloud.redislabs.com',
      port: '17441',
      password: 'E34EBj5v3urkatw1sFaSUSrbmIZbuUql',
    };
  }
  
const redis = require('redis');

let client = null;

  const redisConfig = config();

    client = redis.createClient(redisConfig.port, redisConfig.dbURI, {
      password: redisConfig.password,
      retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with a individual error
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands with a individual error
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
      },
    });
    client.on('connect', () => {
      console.info('Redis connected.');
    });
    client.on('ready', () => {
      console.info('Redis connection estsblished.');
    });
    client.on('error', (err) => {
      console.info(`Redis Error ${err.message}`);
    });
    client.on('reconnecting', () => {
      console.info('Redis client reconnecting to redis server');
    });
    client.on('end', () => {
      console.info('Redis disconnected');
    });

  
  module.exports = client
