nconf = require('nconf');

nconf.argv()
 .env()
 .file({ file: './envConfig.json' });

