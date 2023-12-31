const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

// 配置代理列表
const proxyList = [
    {
        path: '/TEST_API',
        target: 'https://feiying.ahjinti.cn',//师傅驿站
        port: 8086,
    },
];

// 循环创建代理中间件并应用
proxyList.forEach((proxy) => {
    const {path, target, port} = proxy;

    const apiProxy = createProxyMiddleware(path, {
        target,
        changeOrigin: true,
        onProxyRes(proxyRes, req, res) {
            // 允许跨域访问
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            // 监听目标返回的数据
            /*let responseData = '';
            proxyRes.on('data', (chunk) => {
                responseData += chunk;
            });
            proxyRes.on('end', () => {
                try {
                    const formattedData = JSON.parse(responseData);
                    console.log('格式化后的数据:', formattedData);
                } catch (error) {
                    console.error('数据解析错误:', error);
                    console.log('原始数据:', responseData);
                }
            });*/
        },
        pathRewrite: {
            [`^${path}`]: '', // 将路径中的代理路径移除
        },
        onError(err, req, res) {
            console.error('代理错误:', err);
            res.status(500).send('代理错误');
        },
    });

    app.use('/', apiProxy);

    // 启动服务器
    app.listen(port, () => {
        console.log(`服务器${port}已启动`);
    });
});
