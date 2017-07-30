const config = require('../config');
const winston = require('winston');

//timestamp for logger
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new(winston.Logger)({
    transports: [
        // add colors and timestamp
        new(winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
        })
    ]
});
logger.cli();
// logger level is set in the config
logger.level = config.loggerLevel;

export = logger;
