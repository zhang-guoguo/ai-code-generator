// utils/markdownUtils.js

/**
 * 从 Markdown 内容中提取代码块
 * @param {string} markdownContent - Markdown 格式的内容
 * @returns {string} 提取出的代码内容
 */
export function extractCodeFromMarkdown(markdownContent) {
    if (!markdownContent) return '';

    // 匹配 ``` 开头和结尾之间的代码块内容，不包括 ``` 本身所在行
    const codeBlockRegex = /```(?:[a-zA-Z0-9-]*)\n([\s\S]*?)\n```/g;
    const matches = [...markdownContent.matchAll(codeBlockRegex)];
    
    if (matches.length === 0) {
        // 如果没有找到代码块，返回原始内容（可能本身就是代码）
        return markdownContent;
    }

    // 提取第一个代码块的内容
    const code = matches[0][1].trim();
    return code;
}