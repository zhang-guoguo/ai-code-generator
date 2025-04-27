// utils/codeExecutor.js
import { exec } from 'child_process';
import path from 'path';

/**
 * 根据文件类型执行代码
 * @param {string} filePath - 要执行的文件路径
 * @param {function} callback - 执行完成后的回调函数
 */
export function executeCode(filePath, callback) {
    const fileExtension = path.extname(filePath).toLowerCase(); // 获取文件扩展名
    let command;

    // 根据文件扩展名选择执行命令
    switch (fileExtension) {
        case '.js':
            command = `node ${filePath}`; // 执行 Node.js 脚本
            break;
        case '.py':
            command = `python3 ${filePath}`; // 执行 Python 脚本
            break;
        default:
            return callback(`不支持的文件类型: ${fileExtension}`, null);
    }

    // 执行命令
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error.message}`);
            return callback(error.message, null);
        }
        if (stderr) {
            console.error(`标准错误输出: ${stderr}`);
            return callback(stderr, null);
        }
        console.log(`标准输出: ${stdout}`);
        callback(null, stdout);
    });
}