// utils/codeExecutor.js
import { exec } from 'child_process';
import path from 'path';

export function executeCode(filePath) {
    return new Promise((resolve, reject) => {
        // 将代码复制到Docker容器中执行
        const dockerCommand = `
            docker run --rm \
                -v ${path.dirname(filePath)}:/app \
                --read-only \
                --cap-drop=ALL \
                --security-opt=no-new-privileges \
                your-docker-image-name node /app/${path.basename(filePath)}
        `.trim();

        exec(dockerCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Docker执行错误: ${error.message}`);
                reject(new Error(`Docker执行错误: ${error.message}\n标准错误输出: ${stderr}`));
                return;
            }
            if (stderr) {
                console.error(`Docker标准错误输出: ${stderr}`);
                reject(new Error(`Docker标准错误输出: ${stderr}`));
                return;
            }
            console.log(`Docker标准输出: ${stdout}`);
            resolve(stdout);
        });
    });
}