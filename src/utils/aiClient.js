// utils/aiClient.js
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const AI_API_URL = 'https://api.openai.com/v1/chat/completions'; // 修正为正确的端点URL
const API_KEY = process.env.OPENAI_API_KEY;

// 创建代理配置
const httpsAgent = new HttpsProxyAgent('http://127.0.0.1:7890');

export async function generateCode(prompt) {
    try {
        const requestData = {
            model: 'gpt-4.1',
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的代码生成助手，能够根据需求生成高质量的代码"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        };

        console.log('Sending request to OpenAI:', {
            url: AI_API_URL,
            data: requestData,
            proxyUrl: httpsAgent.proxy.href
        });

        const response = await axios.post(
            AI_API_URL,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                httpsAgent
            }
        );

        const generatedCode = response.data.choices[0]?.message?.content;
        console.log("✅ AI 回答", generatedCode);
                
        if (!generatedCode) {
            throw new Error('未收到有效的代码生成响应');
        }

        return generatedCode;
    } catch (error) {
        console.error('AI代码生成失败:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers,
                proxy: httpsAgent.proxy.href
            }
        });
        throw new Error(`AI代码生成过程中出错: ${error.response?.data?.error?.message || error.message}`);
    }
}