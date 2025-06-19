import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(__dirname, '..', '..', 'logs');
const LOG_PATH = path.join(LOG_DIR, 'transfer_logs.json');

/**
 * Logs an entry to a JSON file.
 * If the log file or directory does not exist, it creates them.
 * The log file is structured as a JSON array.
 *
 * @param {Object} logEntry - The log entry to be added.
 */
export function logToFile(logEntry: object) {
    try {
        // Create logs directory if it doesn't exist
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR, { recursive: true });
            console.log(`Created log directory: ${LOG_DIR}`);
        }

        if (!fs.existsSync(LOG_PATH)) {
            fs.writeFileSync(LOG_PATH, '[]', 'utf8');
            console.log(`Created log file: ${LOG_PATH}`);
        }

        let logs = [];
        try {
            const fileContent = fs.readFileSync(LOG_PATH, 'utf8');
            if (fileContent.trim()) {
                logs = JSON.parse(fileContent);
                if (!Array.isArray(logs)) {
                    throw new Error('Log file is not a valid JSON array');
                }
            }
        } catch (err) {
            // console.error(`Error reading/parsing log file: ${err}`);
            logs = [];
        }

        // Append new log entry
        logs.push(logEntry);

        fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2), 'utf8');
        // console.log(`Logged entry: ${JSON.stringify(logEntry)}`);
    } catch (err) {
        console.error(`Error logging to file: ${err}`);
        throw err;
    }
}