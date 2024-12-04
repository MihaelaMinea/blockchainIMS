// logger.js
import EventEmitter from 'events';

class Logger extends EventEmitter {
    static LOG_LEVELS = {
        INFO: 'INFO',
        ERROR: 'ERROR',
        WARN: 'WARN',
    };

    constructor() {
        super();
        // Register the listener to handle 'messageLogged' events
        this.on('messageLogged', this.handleLogEvent);
    }

    log(message, level = Logger.LOG_LEVELS.INFO) {
        const timestamp = new Date().toISOString();
        // Emit the 'messageLogged' event
        this.emit('messageLogged', { level, message, timestamp });
    }

    info(message) {
        this.log(message, Logger.LOG_LEVELS.INFO);
    }

    error(message) {
        this.log(message, Logger.LOG_LEVELS.ERROR);
    }

    warn(message) {
        this.log(message, Logger.LOG_LEVELS.WARN);
    }

    // This method handles the event when 'messageLogged' is emitted
    handleLogEvent({ level, message, timestamp }) {
        switch (level) {
            case Logger.LOG_LEVELS.ERROR:
                console.error(`${timestamp} [ERROR]: ${message}`);
                break;
            case Logger.LOG_LEVELS.WARN:
                console.warn(`${timestamp} [WARN]: ${message}`);
                break;
            case Logger.LOG_LEVELS.INFO:
            default:
                console.log(`${timestamp} [INFO]: ${message}`);
                break;
        }
    }
}

// Export a single instance of Logger
const logger = new Logger();
export default logger;
