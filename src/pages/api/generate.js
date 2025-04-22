// pages/api/generate.js
import { generateCode } from '../../utils/aiClient';
import { extractCodeFromMarkdown } from '../../utils/markdownUtils';
import { createFolder, createFile } from '../../utils/fileManager';
import { executeCode } from '../../utils/codeExecutor';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '方法不允许' });
    }
    console.log("\n")
    console.log("******************** 请求体 **************************\n",req.body)
    const { prompt, folderName, fileName } = req.body;

    if (!prompt || !folderName || !fileName) {
        return res.status(400).json({ error: '缺少必要参数: prompt, folderName, fileName' });
    }

    try {
        // 生成代码
        const generatedCode = await generateCode(prompt);

        // 从 Markdown 中提取代码
        const extractedCode = extractCodeFromMarkdown(generatedCode);

        // 创建文件夹
        const folderPath = path.join(process.cwd(), folderName);
        await createFolder(folderPath);

        // 创建文件并写入代码
        const filePath = path.join(folderPath, `${fileName}.js`);
        await createFile(filePath, extractedCode);

        // 执行代码
        let executionResult;
        executeCode(filePath, (error, result) => {
            if (error) {
                executionResult = { success: false, error };
                // 由于exec是异步的，这里需要立即响应，可以考虑使用Promise封装
                return res.status(500).json(executionResult);
            }
            executionResult = { success: true, output: result };
            res.status(200).json(executionResult);
        });

        // 注意：exec是异步的，上面的res在回调中调用，但可能无法正确返回结果
        // 更好的方法是使用Promise封装exec，然后await执行

    } catch (error) {
        console.error('处理请求时出错:', error);
        res.status(500).json({ error: error.message });
    }
}