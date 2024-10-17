
import winston from 'winston';

// Setup the logger with Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss' // Adding timestamp to log entries
        }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: 'logs.txt' }) // Log to a file
    ]
});

// Logger middleware
const loggerMiddleware = (req, res, next) => {

    const logData = `${req.url} - ${JSON.stringify(req.body || {})}`;
    logger.info(logData);  // Log request URL and body

    next();  // Continue to the next middleware or route
};

export default loggerMiddleware;
