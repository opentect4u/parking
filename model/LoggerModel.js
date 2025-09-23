const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message} \n----------------------------------------------`;
});

// Directory for logs
const logDir = 'log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Cleanup old monthly logs (keep only last 2 months)
function cleanupOldLogs() {
  const files = fs.readdirSync(logDir);
  const monthLogs = files.filter(f => f.startsWith('activity-'));

  // Sort by creation time
  monthLogs.sort((a, b) => {
    const aTime = fs.statSync(path.join(logDir, a)).ctime;
    const bTime = fs.statSync(path.join(logDir, b)).ctime;
    return aTime - bTime;
  });

  // Delete all but last 2 logs
  while (monthLogs.length > 2) {
    const fileToDelete = monthLogs.shift();
    fs.unlinkSync(path.join(logDir, fileToDelete));
  }
}

// Initialize logger
const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
     // Monthly rotating activity log
     new DailyRotateFile({
      // filename: path.join(logDir, 'activity-%b%y.log'), // e.g., activity-Sep25.log
      dirname: logDir, // e.g., activity-Sep25.log
      filename: 'activity-%DATE%.log',
      datePattern: 'MMMYY',
      level: 'info',
      maxFiles: '2m', // keep last 2 months automatically
    }),
    new transports.File({ filename: 'log/error.log', level: 'error' }),
    // new transports.File({ filename: 'log/activity.log', level: 'info'}),
    new transports.Console()
    
  ]
});

// Run cleanup manually (optional, in case older files remain)
cleanupOldLogs();

module.exports = logger;