const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `[${info.level.toUpperCase()}] ${info.timestamp}: ${info.message}`
    ),
  ),
  transports: [
    new winston.transports.Console(),
  ]
})

module.exports = logger;
