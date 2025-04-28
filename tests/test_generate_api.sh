#!/bin/bash

# 测试缺少 language 参数的情况
# echo " ***************** 测试缺少 language 参数的情况 ***************** "
# curl -X POST http://localhost:3000/api/generate \
# -H "Content-Type: application/json" \
# -d '{"prompt": "生成一个简单的 HTTP 服务器","language": ""}' \
# -w "\nHTTP 状态码: %{http_code}\n"
# echo -e

# 测试提供完整参数的情况
echo " ***************** 测试提供完整参数的情况 *****************"
curl -X POST http://localhost:3000/api/generate \
-H "Content-Type: application/json" \
-d '{"prompt": "生成一个简单的 nextjs 服务端项目","language": "nextjs", "reqPath": "/Users/zhangguoguo/MYSPACE"}' \
-w "\nHTTP 状态码: %{http_code}\n"
echo -e
