// pages/api/generate.js
import { generateCode } from '../../utils/aiClient';
import { formatCode } from '../../utils/codeFormatter';
import { extractCodeFromMarkdown } from '../../utils/markdownUtils';
import { createFolder, createFile } from '../../utils/fileManager';
import { executeCode } from '../../utils/codeExecutor';
import { logExecutionResult } from '../../utils/codeLog';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '方法不允许' });
    }
    console.log("\n")
    console.log("******************** 请求体 **************************\n",req.body)
    const { prompt, language, reqPath, fileName: reqFileName } = req.body;
    const folderName = "aiMakeFolder"; 
    const fileName = reqFileName || `${language}-code`;

    if (!prompt || !language) {
        return res.status(400).json({ error: '缺少必要参数: prompt 或 language' });
    }

    // 根据 language 动态设置文件后缀
    const fileExtensionMap = {
        javascript: 'js',
        python: 'py',
        ruby: 'rb',
        java: 'java',
        csharp: 'cs',
        go: 'go',
        php: 'php'
    };
    const fileExtension = fileExtensionMap[language.toLowerCase()] || 'txt'; // 默认使用 .txt

    try {
        // 生成代码时传递语言
        const generatedCode = await generateCode(`${prompt} 使用 ${language} 编写`);

        // 从 Markdown 中提取代码
        const extractedCode = extractCodeFromMarkdown(generatedCode);
        // const formattedCode = formatCode(extractedCode, language === 'python' ? 'python' : 'babel');
        
        // 创建文件夹
        const basePath = reqPath || process.cwd();
        const folderPath = path.join(basePath, folderName);
        await createFolder(folderPath);

        // 创建文件并写入代码
        const filePath = path.join(folderPath, `${fileName}.${fileExtension}`);
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
            if (error) {
                logExecutionResult(filePath, `Error: ${error}`);
                return res.status(500).json({ success: false, error });
            }
            logExecutionResult(filePath, `Output: ${result}`);
            res.status(200).json({ success: true, output: result });
        });

        // 注意：exec是异步的，上面的res在回调中调用，但可能无法正确返回结果
        // 更好的方法是使用Promise封装exec，然后await执行

    } catch (error) {
        console.error('处理请求时出错:', error);
        res.status(500).json({ error: error.message });
    }
}