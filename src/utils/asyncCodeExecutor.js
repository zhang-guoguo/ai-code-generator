// utils/codeExecutor.js
import { exec } from 'child_process';
// import path from 'path';

export function executeCode(filePath) {
    return new Promise((resolve, reject) => {
        const command = `node ${filePath}`; // 假设执行的是Node.js脚本

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error.message}`);
                reject(new Error(`执行错误: ${error.message}\n标准错误输出: ${stderr}`));
                return;
            }
            if (stderr) {
                console.error(`标准错误输出: ${stderr}`);
                reject(new Error(`标准错误输出: ${stderr}`));
                return;
            }
            console.log(`标准输出: ${stdout}`);
            resolve(stdout);
        });
    });
}