// utils/fileManager.js
import fs from 'fs-extra';
// import path from 'path';

export async function createFolder(folderPath) {
    try {
        // 如果文件夹存在，先删除
        if (await fs.pathExists(folderPath)) {
            await fs.remove(folderPath);
            console.log(`🗑️  已删除旧文件夹: ${folderPath}`);
        }
        
        await fs.ensureDir(folderPath);
        console.log(`✅ 文件夹已创建: ${folderPath}`);
    } catch (error) {
        console.error('创建文件夹失败:', error);
        throw new Error('无法创建文件夹');
    }
}

export async function createFile(filePath, content) {
    try {
        await fs.writeFile(filePath, content, 'utf8');
        console.log(`✅ 文件已创建: ${filePath}`);
    } catch (error) {
        console.error('创建文件失败:', error);
        throw new Error('无法创建文件');
    }
}