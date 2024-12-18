const fs = require('fs').promises; 
const path = require('path');
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

class Logger {
    constructor(options = {}) {
        this.logsDir = options.logsDir || './logs';
        this.logFileName = options.logFileName || 'server.log';
        this.logFilePath = path.join(this.logsDir, this.logFileName);
        this.logLevels = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3
        };
        
        this.minLevel = process.env.NODE_ENV === 'production' 
            ? this.logLevels.INFO 
            : this.logLevels.DEBUG;

        this.initializeLogDir();
    }

    async initializeLogDir() {
        try {
            await fs.access(this.logsDir);
        } catch {
            await fs.mkdir(this.logsDir, { recursive: true });
        }
    }

    getTime() {
        return new Date().toISOString(); 
    }

    isError(e) {
        return e instanceof Error;
    }

    formatLogMessage(level, args) {
        const store = asyncLocalStorage.getStore();
        const sessionId = store?.sessionId;
        const sid = sessionId ? `(sid: ${sessionId})` : '';

        const formattedArgs = args.map(arg => {
            if (typeof arg === 'string') return arg;
            if (this.isError(arg)) return `${arg.message}\n${arg.stack}`;
            return JSON.stringify(arg, null, 2);
        });

        return `${this.getTime()} - ${level} - ${formattedArgs.join(' | ')} ${sid}\n`;
    }

    async log(level, ...args) {
        if (this.logLevels[level] < this.minLevel) return;

        try {
            const logMessage = this.formatLogMessage(level, args);
            await fs.appendFile(this.logFilePath, logMessage, 'utf8');
        } catch (error) {
            console.error('Logging failed:', error);
        }
    }

    async debug(...args) {
        return this.log('DEBUG', ...args);
    }

    async info(...args) {
        return this.log('INFO', ...args);
    }

    async warn(...args) {
        return this.log('WARN', ...args);
    }

    async error(...args) {
        return this.log('ERROR', ...args);
    }
}

const logger = new Logger();

module.exports = logger;

/////////////////////////////////////////

// const fs = require('fs')
// // const asyncLocalStorage = require('./als.service')


// const logsDir = './logs'
// if (!fs.existsSync(logsDir)) {
//     fs.mkdirSync(logsDir)
// }

// //define the time format
// function getTime() {
//     let now = new Date()
//     return now.toLocaleString()
// }


// function isError(e) {
//     return e && e.stack && e.message;
// }

// function doLog(level, ...args) {

//     const strs = args.map(arg =>
//         (typeof arg === 'string') ? arg :
//         (isError(arg)) ? arg : JSON.stringify(arg))

//     var line = strs.join(' | ')
//     const store = asyncLocalStorage.getStore()
//     const sessionId = store?.sessionId
//     const sid = sessionId ? `(sid: ${sessionId})` : ''
//     line = `${getTime()} - ${level} - ${line} ${sid}\n`
//     fs.appendFileSync('./logs/backend.log', line)
// }

// module.exports = {
//     debug(...args) {
//         // if (process.env.NODE_NEV === 'production') return
//         doLog('DEBUG', ...args)
//     },
//     info(...args) {
//         doLog('INFO', ...args)
//     },
//     warn(...args) {
//         doLog('WARN', ...args)
//     },
//     error(...args) {
//         doLog('ERROR', ...args)
//     }
// }