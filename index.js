// set environment variables first
require('./envVars');

// set globals
require('./globals');

const { mongoose, server } = require('./config');

// mongoose.init();

// Start API Server
require('./web/server');

logger.info(`Environment: ${server.env}`);

// uncaughtException Exception notification sent to Slack channel
process.on('uncaughtException', (err) => {
    logger.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    logger.error(err.stack);
    process.exit(1);
});