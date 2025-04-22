// utils/markdownUtils.js

/**
 * 从 Markdown 内容中提取代码块
 * @param {string} markdownContent - Markdown 格式的内容
 * @returns {string} 提取出的代码内容
 */
export function extractCodeFromMarkdown(markdownContent) {
    if (!markdownContent) return '';

    // 匹配 ```language\n...code...``` 格式的代码块
    const codeBlockRegex = /```(?:javascript|js|JavaScript（Node.js 或浏览器）|)\n([\s\S]*?)```/g;
    const matches = [...markdownContent.matchAll(codeBlockRegex)];
    
    if (matches.length === 0) {
        // 如果没有找到代码块，返回原始内容（可能本身就是代码）
        return markdownContent;
    }

    // 提取第一个代码块的内容
    const code = matches[0][1].trim();
    return code;
} 