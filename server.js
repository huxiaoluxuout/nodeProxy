const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const cors = require('cors');

// 创建代理服务器函数
function createProxyServer({path, target}) {
    const app = express();
    app.use(cors());

    app.use(path, createProxyMiddleware({
        target,
        changeOrigin: true,
        onProxyRes(proxyRes, req, res) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        },
        pathRewrite: {
            [`^${path}`]: '',
        },
    }));

    return app;
}

// 配置每个代理服务器
const proxyConfigurations = [
    {path: '/api', target: 'https://feiying.ahjinti.cn'},
    // {path: '/anotherApi', target: 'https://another-server.example.com'},
];

// 启动多个代理服务器
proxyConfigurations.forEach(({path, target}, index) => {
    const app = createProxyServer({path, target});
    const PORT = 3000 + index; // 3000, 3001, ...

    app.listen(PORT, () => {
        console.log(`代理服务器 ${index + 1} http://localhost:${PORT} 已启动，监听端口 ${PORT}`);
    });
});
