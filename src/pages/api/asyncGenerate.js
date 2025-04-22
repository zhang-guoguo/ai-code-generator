// pages/api/generate.js
import { generateCode } from '../../utils/aiClient';
import { createFolder, createFile } from '../../utils/fileManager';
import { executeCode } from '../../utils/codeExecutor';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '方法不允许' });
    }

    const { prompt, folderName, fileName } = req.body;

    if (!prompt || !folderName || !fileName) {
        return res.status(400).json({ error: '缺少必要参数: prompt, folderName, fileName' });
    }

    try {
        // 生成代码
        const generatedCode = await generateCode(prompt);

        // 创建文件夹
        const folderPath = path.join(process.cwd(), folderName);
        await createFolder(folderPath);

        // 创建文件并写入代码
        const filePath = path.join(folderPath, `${fileName}.js`);
        await createFile(filePath, generatedCode);

        // 执行代码
        const output = await executeCode(filePath);

        res.status(200).json({ success: true, output });

    } catch (error) {
        console.error('处理请求时出错:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}