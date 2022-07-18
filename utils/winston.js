const appRoot = require('app-root-path');
const winston = require('winston');

  // 
  //export NODE_ENV=development
  //console.log(`process.env.NODE_ENV ${process.env.NODE_ENV}`);
  let mylogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    //defaultMeta: { service: 'user-service' },  
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //    
      new winston.transports.File({
        filename: `${appRoot}/logs/error.log`, level: 'error',
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss A ZZ'
          }),
          winston.format.json()
        ),
        handleExceptions: true
      }),
      new winston.transports.File({
        filename: `${appRoot}/logs/info.log`,
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss A ZZ'
          }),
          winston.format.json()
        ),
        handleExceptions: true
      })
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    mylogger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
  mylogger.info("init");
  module.exports = mylogger;


