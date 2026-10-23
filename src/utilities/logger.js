const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const moment = require('moment-timezone');
const config = require('../config/config');

// Setup file rotation transport
const transport = new winston.transports.DailyRotateFile({
  dirname: config.logDir || 'logs',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '60d'
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.printf(({ level, message }) => {
      const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss.SSS');
      return `${timestamp}, [${level.toUpperCase()}], ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message }) => {
          const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss.SSS');
          return `${timestamp} [${level}]: ${message}`;
        })
      )
    }),
    transport
  ]
});

module.exports = logger;
