var winston = require('winston');
var fs = require('fs');
var dir = 'logs';

if(!fs.existsSync(dir))
  fs.mkdirSync(dir);

module.exports = new winston.Logger({
    transports: [
      new winston.transports.File({
        level: "info",
        filename: "logs/payfast.log",
        maxsize: 100000,
        maxFile: 10
      })
    ]
  });
