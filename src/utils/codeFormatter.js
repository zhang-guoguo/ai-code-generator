import prettier from 'prettier';

export function formatCode(code, parser = 'babel') {
    try {
        return prettier.format(code, { parser });
    } catch (error) {
        console.error('代码格式化失败:', error);
        return code; // 如果格式化失败，返回原始代码
    }
}