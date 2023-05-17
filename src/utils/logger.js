/**
 * @module Logger used for debugging and logging
 */

import { createLogger, transports, format } from 'winston';

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.simple()
              )
        }),
        new transports.File({ 
            level: 'debug',
            filename: 'debug.log',
        })
    ]
});

export default logger;