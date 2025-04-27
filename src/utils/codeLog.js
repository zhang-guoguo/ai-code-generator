import fs from 'fs-extra';
import path from 'path';

export function logExecutionResult(filePath, result) {
    const logFilePath = path.join(path.dirname(filePath), 'execution.log');
    const logEntry = `[${new Date().toISOString()}] ${result}\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
}